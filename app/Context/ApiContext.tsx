import React, { createContext, useState, useEffect } from "react";
import axiosInstance, { apiKey, baseUrl, deviceUuid } from "../../env";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from "react-native";
import axios from "axios";

export const ApiContext = createContext();

const ApiProvider = ({ children }) => {
    const [categoriesData, setCategoriesData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [inspiration, setInspiration] = useState([]);
    const [currentUserPlan, setCurrentUserPlan] = useState({});

    const [loading, setLoading] = useState(true);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [error, setError] = useState(null);

    const [themes, setThemes] = React.useState([]);
    const [is_theme_loading, setIsThemeLoading] = React.useState(false);

    const [isGeneratedButtonLoading, setIsGeneratedButtonLoading] = React.useState(false);

    const getCategories = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${baseUrl}/setup/getcategories`)
            setCategoriesData(response.data);
            // console.log(response.data);
        } catch (error) {
            setError(error);
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoriesOnly = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${baseUrl}/setup/getcategoriesonly`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSubcategories = async (categoryId: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${baseUrl}/setup/getsubcategory/${categoryId}`);
            setSubcategories(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        } finally {
            setLoading(false);
        }
    };

    const getThemes = () => {
        setIsThemeLoading(true);
        axiosInstance.get(`${baseUrl}/setup/getimagethemes`)
            .then(response => {
                setThemes(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            }).finally(() => {
                setIsThemeLoading(false);
            })
    }

    const uploadImage = async (image) => {
        setIsImageUploading(true);
        let data = new FormData();
        data.append('userId', deviceUuid);
        data.append('file', {
            uri: image.uri,
            type: 'image/jpeg',
            name: 'test.jpg'
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseUrl}/images/upload`,
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'multipart/form-data',
            },
            data: data
        };
        console.log(data);

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setIsGeneratedButtonLoading(true);
            })
            .catch((error) => {
                console.error(error);
                setIsGeneratedButtonLoading(false);
            }).finally(() => {
                setIsImageUploading(false);
            });
    };

    const saveImageFromGallery = async (imageUri) => {
        try {
            // طلب الإذن للوصول إلى معرض الصور
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('error', 'Permission to access the gallery is required.');
                return;
            }

            // الحصول على اسم الملف من رابط الصورة
            const fileName = imageUri.split('/').pop();

            // تحديد مسار لحفظ الصورة في مجلد التطبيق
            const destinationUri = `${FileSystem.documentDirectory}${fileName}`;

            // تنزيل الصورة من الرابط
            const downloadResult = await FileSystem.downloadAsync(imageUri, destinationUri);

            // حفظ الصورة في معرض الصور
            const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
            await MediaLibrary.createAlbumAsync('MyAppImages', asset, false);

            Alert.alert('success', 'The image has been saved to your active gallery!');
            console.log('Image saved to gallery:', asset.uri);
            return asset.uri; // إرجاع مسار الصورة في المعرض
        } catch (error) {
            console.error('Error saving image:', error.message);
            Alert.alert('error', 'An error occurred while saving the image.');
            throw error;
        }
    };

    const getInspiration = async () => {
        try {
            const response = await axiosInstance.get(`${baseUrl}/setup/getinspiration`);
            setInspiration(response.data);
            console.log('Inspiration data:' + response.data);
        } catch (error) {
            console.error('Error fetching inspiration:', error);
        }
    }

    const getCurrentUserPlan = async () => {
        try {
            const response = await axiosInstance.get(`${baseUrl}/setup/getuserplan/${deviceUuid}`);
            console.log(response.data);
            setCurrentUserPlan(response.data);
        } catch (error) {
            console.error('Error fetching user plan:', error);
        }
    }

    useEffect(() => {
        getCategories();
        getCurrentUserPlan();
    }, []);

    return (
        <ApiContext.Provider value={{
            categoriesData, loading,
            getCategories, error,
            categories, getCategoriesOnly,
            subcategories, getSubcategories,
            themes, getThemes, is_theme_loading,
            uploadImage, saveImageFromGallery, isImageUploading,
            isGeneratedButtonLoading,
            getInspiration, inspiration,
            setIsGeneratedButtonLoading,
            getCurrentUserPlan, currentUserPlan
        }}>
            {children}
        </ApiContext.Provider>
    );
};

export default ApiProvider;
