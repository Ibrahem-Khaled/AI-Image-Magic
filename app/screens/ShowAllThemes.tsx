import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../Components/Header';
import MainView from '../Components/MainView';
import { ApiContext } from '../Context/ApiContext';
import { TextInput } from 'react-native-paper';

const ShowAllThemes = ({ route, navigation }) => {
    const { themes, getThemes } = useContext<any>(ApiContext);
    const { onSelectTheme } = route.params;

    // حالة لتتبع النص المدخل للبحث
    const [searchText, setSearchText] = useState('');
    const [filteredThemes, setFilteredThemes] = useState<any[]>([]);
    const handleSelect = (id) => {
        if (onSelectTheme) {
            onSelectTheme(id); // استدعاء الوظيفة الممررة مع ID الشكل
        }
        navigation.goBack(); // العودة إلى الشاشة السابقة
    };

    useEffect(() => {
        getThemes();
    }, []);

    // تحديث القائمة المصفاة عند تغيّر النص المدخل أو البيانات الأصلية
    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredThemes(themes);
        } else {
            const filtered = themes.filter((theme: any) =>
                theme.Name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredThemes(filtered);
        }
    }, [searchText, themes]);

    return (
        <MainView>
            <Header Title="Set Theme" IsBack />
            <TextInput
                inputMode="search"
                placeholder="Search"
                placeholderTextColor={'#ED7EFF'}
                label={'Search Themes ...'}
                mode="outlined"
                style={styles.input}
                outlineStyle={{ borderColor: '#ED7EFF', borderRadius: 12 }}
                value={searchText}
                onChangeText={(text) => setSearchText(text)} // تحديث النص المدخل
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                {filteredThemes.map((theme: any, index) => (
                    <TouchableOpacity style={styles.buttonContainer} key={index} onPress={() => handleSelect(theme.ID)}
                    >
                        <Image
                            source={{ uri: theme.IconURL }}
                            resizeMode="contain"
                            style={{ width: '100%', height: 150, backgroundColor: 'rgba(255,255,255,.5)' }}
                        />
                        <Text style={{ color: '#fff', marginVertical: 10, fontFamily: 'Inter-Bold' }}>{theme.Name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </MainView>
    );
};

export default ShowAllThemes;

const styles = StyleSheet.create({
    input: {
        width: '90%',
        marginVertical: 10,
        alignSelf: 'center',
        backgroundColor: '#191919',
        color: '#fff',
    },
    buttonContainer: {
        width: '45%',
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
});
