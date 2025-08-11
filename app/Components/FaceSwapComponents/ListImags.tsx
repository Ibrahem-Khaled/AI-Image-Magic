import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Pressable } from 'react-native';
import React from 'react';
import ADAPTIVEbanner from '../AdsComponents/ADAPTIVEbanner';

const ListImagesWithCategories = ({ categories, navigation }) => {
    return (
        <View style={styles.container}>
            {categories.map((category) => (
                <View key={category.Category_ID} style={styles.categoryContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{category.Name}</Text>
                        <TouchableOpacity onPress={() => { navigation.navigate('subCategory', { categoryID: category.Category_ID, }) }} style={styles.seeAllButton}>
                            <Text style={styles.seeAllText}>SEE ALL</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={category.SubCategories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <>
                                {/* Render الإعلان بعد كل 3 عناصر */}
                                {index % 3 === 0 && index !== 0 && (
                                    // <ADAPTIVEbanner />
                                    null
                                )}
                                <Pressable onPress={() => {
                                    navigation.navigate('FaceSwapGenerate', {
                                        faceswap: item,
                                        subCategory_id: item.SubcategoryID
                                    })
                                }}
                                    style={styles.imageContainer}>
                                    <Image source={{ uri: item.ImageURL }} style={styles.image} resizeMode="cover" />
                                    {/* <Text style={styles.imageTitle}>{item.Name}</Text> */}
                                </Pressable>
                            </>
                        )}
                        keyExtractor={(item) => item.SubcategoryID.toString()}
                        contentContainerStyle={styles.imageList}
                    />
                </View>
            ))}
        </View>
    );
};

export default ListImagesWithCategories;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    seeAllButton: {
        borderWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 2,
        borderRadius: 20,
    },
    seeAllText: {
        fontSize: 12,
        color: '#fff',
    },
    imageList: {
        paddingHorizontal: 16,
    },
    imageContainer: {
        alignItems: 'center',
        margin: 5,
    },
    image: {
        width: 130,
        height: 260,
        borderRadius: 8,
        marginBottom: 5,
    },
    imageTitle: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
});
