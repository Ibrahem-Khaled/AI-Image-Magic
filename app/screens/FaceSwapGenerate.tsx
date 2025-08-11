import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../Components/Header';
import { AntDesign, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { ApiContext } from '../Context/ApiContext';
import axiosInstance, { baseUrl, blurhash, deviceUuid } from '../../env';
import Loading from '../Components/Loading';
import MainView from '../Components/MainView';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import CarouselComponent from '../Components/FaceSwapComponents/CarouselComponent';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';


const FaceSwapGenerate = ({ route }) => {
    const { faceswap, subCategory_id } = route.params;
    const { getSubcategories,
        subcategories,
        uploadImage,
        setIsGeneratedButtonLoading,
        isGeneratedButtonLoading,
        loading: loadingFromApi,
        getCurrentUserPlan,
        currentUserPlan,
        isImageUploading
    } = useContext<any>(ApiContext);

    const [subCategorySelected, setSubCategorySelected] = useState(subCategory_id);
    console.log('subCategorySelected', subCategorySelected);

    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAdVisible, setIsAdVisible] = useState(false);
    const navigation = useNavigation<any>();

    useEffect(() => {
        getSubcategories(faceswap?.Category_ID);
        setIsGeneratedButtonLoading(false);
    }, []);

    const compressImage = async (imageUri) => {
        console.log('Compressing image...');

        // الحصول على معلومات الملف
        const fileInfo = await FileSystem.getInfoAsync(imageUri);

        if (!fileInfo.exists) {
            throw new Error('File does not exist.');
        }

        console.log('Original Image Size:', fileInfo.size);

        // إذا كان الحجم أكبر من 1 ميغابايت، قم بضغط الصورة
        if (fileInfo.size > 1024 * 1024) {
            console.log('Compressing image...');
            const compressedImage = await ImageManipulator.manipulateAsync(
                imageUri,
                [],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );

            const compressedFileInfo = await FileSystem.getInfoAsync(compressedImage.uri);

            if (!compressedFileInfo.exists) {
                throw new Error('Compressed file does not exist.');
            }

            console.log('Compressed Image Size:', compressedFileInfo.size);

            if (compressedFileInfo.size > 1024 * 1024) {
                throw new Error('Image is still too large after compression. Please select a smaller image.');
            }

            return compressedImage.uri;
        }
        return imageUri;
    };


    const pickImageFromLibrary = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });
            setModalVisible(false);

            if (!result.canceled) {
                const selectedImageUri = result.assets[0].uri;

                // تحقق من الحجم واضغط الصورة إذا لزم الأمر
                const processedImageUri = await compressImage(selectedImageUri);

                // إعداد الصورة النهائية
                const processedImage = { ...result.assets[0], uri: processedImageUri };
                setImage(processedImage);

                // رفع الصورة
                await uploadImage(processedImage);
            }
        } catch (error) {
            console.error('Error picking image from library:', error.message);
        }
    };

    const pickImageFromCamera = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
            });
            setModalVisible(false);

            if (!result.canceled) {
                const capturedImageUri = result.assets[0].uri;

                // تحقق من الحجم واضغط الصورة إذا لزم الأمر
                const processedImageUri = await compressImage(capturedImageUri);

                // إعداد الصورة النهائية
                const processedImage = { ...result.assets[0], uri: processedImageUri };
                setImage(processedImage);

                // رفع الصورة
                await uploadImage(processedImage);
            }
        } catch (error) {
            console.error('Error capturing image:', error.message);
        }
    };

    const checkStatus = async (id: string, retries: number, delay: number) => {
        console.log(`${baseUrl}/images/getgenratestatus/${deviceUuid}/${id}`);
        try {
            const response = await axiosInstance.get(`${baseUrl}/images/getgenratestatus/${deviceUuid}/${id}`);
            const data = response.data;
            if (data.status === "COMPLETED") {
                console.log("Image generation completed:", data);
                navigation.navigate('GeneratedImage', { image: data.outputUrls[0] });
                return data;
            } else if ((data.status === "QUEUED" || data.status === "STARTED" || data.status === "PENDING") && retries > 0) {
                console.log("Status is still in progress. Retrying...");
                console.warn(data);
                await new Promise(resolve => setTimeout(resolve, delay));
                return checkStatus(id, retries - 1, delay);
            } else {
                alert(data.Message);
                throw new Error("Max retries reached or unknown status: " + data.status);
            }
        } catch (error) {
            console.error("Error checking status:", error);
            throw error;
        }
    };

    const generateFaceSwap = async () => {
        if (isAdVisible) {
            alert("Please select a valid subcategory, not an ad."); return;
        }
        if (!image) { ToastAndroid.show('Please select an image', ToastAndroid.SHORT); return }

        if (isImageUploading) { ToastAndroid.show('Please wait for image upload to complete', ToastAndroid.SHORT); return; }

        if (currentUserPlan.DailyUsage >= currentUserPlan.MaxImagesPerDay) return Alert.alert('Error', 'You have reached your daily limit. Please upgrade your plan to create more images.');
        setLoading(true);
        try {
            const response = await axiosInstance.post(`${baseUrl}/images/faceswap`, {
                user_Id: deviceUuid,
                category_Id: faceswap.Category_ID,
                subcategory_Id: subCategorySelected,
                function_Id: 1,
            });

            console.warn({
                user_Id: deviceUuid,
                category_Id: faceswap.Category_ID,
                subcategory_Id: subCategorySelected,
                function_Id: 1
            });

            const imageId = response.data.id;

            console.warn(response.data);

            console.log("Image generation started. ID:", imageId);
            await checkStatus(imageId, 20, 5000);
        } catch (error) {
            console.error("Error generating image:", error);
        } finally {
            setLoading(false);
            getCurrentUserPlan();
        }
    };

    return (
        <MainView>
            <Header IsBack Title="Face Swap" />
            {loading || loadingFromApi ? (
                <Loading />
            ) : (
                <>
                    <CarouselComponent subcategories={subcategories}
                        setSubCategorySelected={setSubCategorySelected}
                        subCategory_id={subCategory_id} setIsAdVisible={setIsAdVisible} isAdVisible={isAdVisible} />

                    <Text style={styles.addText}>Add your photo</Text>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={styles.imageButton}
                        >
                            {image ? (
                                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                            ) : (
                                <Image source={require('../images/icons/Image.png')} style={styles.imagePreview} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={generateFaceSwap} style={[styles.generateButton, {
                        opacity: isGeneratedButtonLoading ? 1 : 1,
                        backgroundColor: isGeneratedButtonLoading ? '#0079F3' : '#0079F3'
                    }]}>
                        {!isGeneratedButtonLoading ? <Text style={styles.generateButtonText}>Generate</Text>
                            :
                            <Text style={styles.generateButtonText}>Generate</Text>}

                    </TouchableOpacity>
                </>
            )}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Your Photo</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                            <TouchableOpacity onPress={pickImageFromLibrary} style={styles.modalButton}>
                                <FontAwesome6 name="images" size={24} color="#fff" />
                                <Text style={styles.modalButtonText}>Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImageFromCamera} style={styles.modalButton}>
                                <FontAwesome name="camera" size={24} color="#fff" />
                                <Text style={styles.modalButtonText}>Camera</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.cancelButton}
                        >
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </MainView>
    );
};


const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    image: {
        width: '80%',
        height: '85%',
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    itemContainer: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    imageButton: {
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    addText: {
        color: '#5A5A5B',
        marginTop: 10,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Inter-Bold'
    },
    generateButton: {
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#0079F3',
        marginVertical: 20,
        borderRadius: 10,
        paddingVertical: 20,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: '#000000',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: '#fff',
    },
    modalButton: {
        width: '40%',
        backgroundColor: '#1C1C1C',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
        paddingVertical: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#fff',
        position: 'absolute',
        top: 20,
        right: 40,
        borderRadius: 10,
    },
});

export default FaceSwapGenerate;
