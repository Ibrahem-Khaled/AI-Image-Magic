import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Pressable, ToastAndroid } from 'react-native';
import Header from '../Components/Header';
import axiosInstance, { baseUrl, deviceUuid } from '../../env';
import Loading from '../Components/Loading';
import { ActivityIndicator } from 'react-native-paper';
import { ApiContext } from '../Context/ApiContext';
import { useNavigation } from '@react-navigation/native';
import MainView from '../Components/MainView';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';

const ImagineScreen = ({ route }) => {
    const { themes, getThemes, is_theme_loading, getInspiration, inspiration, getCurrentUserPlan, currentUserPlan } = useContext<any>(ApiContext);
    const [user_prompt, setUserPrompt] = React.useState('');
    const [image_theme_id, setImageThemeId] = React.useState('');
    const [Ratio, setRatio] = React.useState('16:9');
    const [loading, setLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedInspiration, setSelectedInspiration] = useState(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        getThemes();
        getInspiration();
    }, []);

    const checkStatus = async (id: string, retries = 10, delay = 5000) => {
        try {
            const response = await axiosInstance.get(`${baseUrl}/images/getgenratestatus/${deviceUuid}/${id}`);
            const data = response.data;
            if (data.status === "COMPLETED") {
                console.log("Image generation completed:", data);
                navigation.navigate('GeneratedImage', { image: data.outputUrls[0] });
                return data;
            } else if ((data.status === "QUEUED" || data.status === "STARTED" || data.status === "PENDING") && retries > 0) {
                console.log("Status is still in progress. Retrying...");
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

    const generateImage = async () => {
        if (user_prompt === '') return Alert.alert('Error', 'Please enter a prompt');
        if (image_theme_id === '') return Alert.alert('Error', 'Please select a theme');
        if (currentUserPlan.DailyUsage >= currentUserPlan.MaxImagesPerDay) return Alert.alert('Error', 'You have reached your daily limit. Please upgrade your plan to create more images.');
        setLoading(true);
        try {
            const response = await axiosInstance.post(`${baseUrl}/images/text2image`, {
                userId: deviceUuid,
                user_prompt: user_prompt,
                image_theme_id: image_theme_id,
                aspect_ratio: Ratio
            });

            const imageId = response.data.id;
            console.log("Image generation started. ID:", imageId);

            await checkStatus(imageId);
        } catch (error) {
            console.error("Error generating image:", error);
        } finally {
            setLoading(false);
            getCurrentUserPlan();
        }
    };

    const handleInspirationPress = (item) => {
        setSelectedInspiration(item);
        setModalVisible(true);
    };

    const copyToClipboard = () => {
        if (selectedInspiration) {
            Clipboard.setStringAsync(selectedInspiration.Prompt);
            ToastAndroid.show('Prompt copied to clipboard', ToastAndroid.SHORT);
        }
    };

    return (
        <MainView>
            <Header Title="Imagine" />
            {loading ? <Loading /> :
                (
                    <>
                        {/* Input Section */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputTitle}>Type your idea</Text>
                            <View style={styles.inputBox}>
                                <TextInput
                                    style={styles.inputPlaceholder}
                                    placeholder="Describe the scene you want to create"
                                    placeholderTextColor={'#fff'}
                                    onChangeText={(text) => setUserPrompt(text)}
                                    value={user_prompt}
                                    multiline
                                />
                            </View>
                        </View>

                        {/* Themes Section */}
                        <View style={styles.themeSection}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                                <Text style={styles.sectionTitle}>Set a theme</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('ShowAllThemes', {
                                        onSelectTheme: (selectedId) => {
                                            console.log('Selected Theme ID:', selectedId);
                                            setImageThemeId(selectedId);
                                        },
                                    })}
                                >
                                    <Text style={styles.seeAll}>See all</Text>
                                </TouchableOpacity>
                            </View>

                            {is_theme_loading ?
                                <ActivityIndicator
                                    size={"large"}
                                    color='#fff'
                                    style={{ marginVertical: 45, }}
                                />
                                :
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeList}>
                                    {themes.map((theme, index) => (
                                        <TouchableOpacity
                                            onPress={() => setImageThemeId(theme.ID)} key={index} style={[styles.themeItem, image_theme_id === theme.ID && styles.themeItemActive]}>
                                            <Image source={{ uri: theme.IconURL }} style={styles.themeImage} />
                                            <Text style={styles.themeText}>{theme.Name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('TextToImageSetting',
                                    {
                                        onSelectAspectRatio: (selectedRatio) => {
                                            console.log('Selected Aspect Ratio:', selectedRatio);
                                            setRatio(selectedRatio);
                                        }
                                    }
                                )}
                            >
                                <Image source={require('../images/icons/favicon.png')}
                                    style={{ width: 57, height: 57 }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={generateImage}
                                style={{
                                    height: 57,
                                    width: '70%',
                                    justifyContent: 'center',
                                    backgroundColor: '#fff',
                                    borderRadius: 18,
                                    alignItems: 'center',
                                }}>
                                <Text style={{ fontFamily: 'Inter-SemiBold', color: '#000', fontSize: 16 }}>Create</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Inspirations Section */}
                        <View style={styles.inspirationSection}>
                            <Text style={styles.sectionTitle}>Inspirations</Text>
                            <View style={styles.inspirationList}>
                                {inspiration.map((item, index) => (
                                    <Pressable key={index} onPress={() => handleInspirationPress(item)}>
                                        <Image key={index} source={{ uri: item.ImageUrl }}
                                            style={styles.inspirationImage} />
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Modal */}
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    {selectedInspiration && (
                                        <>
                                            <Image source={{ uri: selectedInspiration.ImageUrl }} style={styles.modalImage} />
                                            <Text onPress={copyToClipboard} style={styles.modalText}>{selectedInspiration.Prompt}
                                            </Text>
                                            {/* <Feather name="copy" size={24} color="#fff" style={{
                                                position: 'absolute',
                                                top: '60%',
                                                right: 20,
                                                padding: 10,
                                                backgroundColor: '#444',
                                                borderRadius: 50
                                            }} /> */}
                                        </>
                                    )}
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </>
                )
            }
        </MainView>
    );
};

export default ImagineScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    inputTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'Inter-SemiBold',
    },
    inputBox: {
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ED7EFF',
        justifyContent: 'space-between',
        height: 120
    },
    inputPlaceholder: {
        color: '#888',
        flex: 1,
    },
    inputButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 10,
    },
    addText: {
        marginLeft: 5,
        color: '#000',
    },
    tagButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#444',
        padding: 8,
        borderRadius: 10,
    },
    tagText: {
        marginLeft: 5,
        color: '#fff',
    },
    themeSection: {
        marginBottom: 20,
        padding: 10
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },
    seeAll: {
        color: '#aaa',
    },
    themeList: {
        marginTop: 10,
    },
    themeItem: {
        alignItems: 'center',
        margin: 15,
    },
    themeItemActive: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
    },
    themeImage: {
        width: 75,
        height: 75,
        borderRadius: 50,
        marginBottom: 5,
        backgroundColor: '#fff',
    },
    themeText: {
        color: '#fff',
    },
    inspirationSection: {
        margin: 10,
        padding: 15
    },
    inspirationList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    inspirationImage: {
        width: 159,
        height: 95,
        borderRadius: 10,
        margin: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalImage: {
        width: 300,
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    modalText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 15,
    },
    closeButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        width: 200,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#000',
        fontSize: 16,
    },
});