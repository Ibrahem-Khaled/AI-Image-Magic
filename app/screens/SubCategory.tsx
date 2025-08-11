import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../Components/Header';
import { Feather } from '@expo/vector-icons';
import { ApiContext } from '../Context/ApiContext';
import { useNavigation } from '@react-navigation/native';
import MainView from '../Components/MainView';
import Loading from '../Components/Loading';
import ADAPTIVEbanner from '../Components/AdsComponents/ADAPTIVEbanner';
import { BannerAdSize } from 'react-native-google-mobile-ads';

const SubCategory = ({ route }) => {
    const { categoryID } = route.params;
    const [activeCategory, setActiveCategory] = useState(categoryID);
    const { categories, getCategoriesOnly, loading, subcategories, getSubcategories } = useContext<any>(ApiContext);
    const navigation = useNavigation<any>();


    useEffect(() => {
        getCategoriesOnly();
        getSubcategories(categoryID);
    }, [categoryID]);

    const handleCategoryPress = (categoryId) => {
        setActiveCategory(categoryId);
        getSubcategories(categoryId);
    };

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.categoryButton,
                activeCategory === item.Category_ID && styles.categoryButtonActive,
            ]}
            onPress={() => handleCategoryPress(item.Category_ID)}
        >
            <Text
                style={[
                    styles.categoryText,
                    activeCategory === item.Category_ID && styles.categoryTextActive,
                ]}
            >
                {item.Name || 'Category'}
            </Text>
            <Image
                source={{ uri: item.IconURL }}
                
                style={{ width: 24, height: 24, borderRadius: 50, backgroundColor: 'white', alignSelf: 'center', marginHorizontal: 10 }}
            />
        </TouchableOpacity>
    );

    return (
        <MainView>
            <Header IsBack={true} Title="FaceSwap" />
            {loading ? <Loading />
                :
                (
                    <>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.Category_ID.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderCategoryItem}
                            contentContainerStyle={styles.categoriesContainer}
                        />

                        <View style={{
                            padding: 16,
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: '87%',
                            width: '100%',
                        }}>
                            {subcategories.length > 0 ? (
                                subcategories.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {/* إضافة صورة */}
                                        <Pressable onPress={() => navigation.navigate('FaceSwapGenerate', {
                                            faceswap: item,
                                            subCategory_id: item.SubcategoryID
                                        })}
                                            style={styles.imageContainer}>
                                            <Image resizeMode="cover" source={{ uri: item.ImageURL }} style={styles.image} />
                                            {/* <TouchableOpacity style={styles.bookmarkButton}>
                                                <Feather name="bookmark" size={24} color="#fff" />
                                            </TouchableOpacity> */}
                                        </Pressable>

                                        {/* إضافة إعلان بعد كل 3 صور */}
                                        {((index + 1) % 4 === 0) && (
                                            // <ADAPTIVEbanner Size={BannerAdSize.LEADERBOARD} />
                                            null
                                        )}
                                        <View style={{ height: 100 }} />
                                    </React.Fragment>
                                ))
                            ) : (
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <Feather name="info" size={24} color="white" />
                                    <Text style={{ color: 'white' }}>No results found</Text>
                                </View>
                            )}
                        </View>
                    </>
                )
            }

        </MainView>
    );
};

export default SubCategory;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    categoriesContainer: {
        padding: 16,
        height: 75,
    },
    categoryButton: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1B1B1B',
        borderRadius: 17,
        marginRight: 10,
        height: 40,
    },
    categoryButtonActive: {
        backgroundColor: '#3A7DFF',
    },
    categoryText: {
        color: 'white',
        marginHorizontal: 8,
    },
    categoryTextActive: {
        fontWeight: 'bold',
        color: 'white',
    },
    imageList: {
        padding: 16,
    },
    imageContainer: {
        width: 110,
        height: 220,
        margin: 8,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    bookmarkButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 50,
        padding: 5,
    },
});
