import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import ADAPTIVEbanner from '../AdsComponents/ADAPTIVEbanner';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CarouselComponent = ({ subcategories, setSubCategorySelected, subCategory_id, setIsAdVisible, isAdVisible }) => {
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const initialIndex = subcategories.findIndex(
            (item) => item.SubcategoryID === subCategory_id
        );

        if (initialIndex >= 0) {
            setTimeout(() => {
                if (scrollViewRef.current) {
                    // حساب الإزاحة مع الأخذ في الاعتبار الإعلانات
                    const offset = initialIndex * (SCREEN_WIDTH * 0.8) + Math.floor(initialIndex / 2) * (SCREEN_WIDTH * 0.8);
                    scrollViewRef.current.scrollTo({
                        x: offset,
                        animated: true,
                    });
                    setCurrentIndex(initialIndex);
                }
            }, 500);
        }
    }, [subcategories]);

    const handleScrollEnd = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / (SCREEN_WIDTH * 0.8));

        // حساب الفهرس الفعلي في المصفوفة `subcategories`
        const actualIndex = Math.floor(newIndex / 3) * 2 + (newIndex % 3);

        // تحقق مما إذا كان العنصر الحالي إعلانًا
        const isAd = (newIndex + 1) % 3 === 0; // الإعلانات تظهر بعد كل عنصرين
        setIsAdVisible(isAd);

        // إذا لم يكن إعلانًا، قم بتحديث النقطة النشطة
        if (!isAd) {
            setCurrentIndex(actualIndex);

            const selectedSubCategory = subcategories[actualIndex];
            if (selectedSubCategory) {
                setSubCategorySelected(selectedSubCategory?.SubcategoryID);
            }
        }
    };

    const renderItemsWithAds = () => {
        const itemsWithAds = [];
        subcategories.forEach((item, index) => {
            // أضف العنصر الأساسي
            itemsWithAds.push(
                <View key={`item-${index}`} style={styles.itemContainer}>
                    <Image
                        source={{ uri: item.ImageURL }}
                        style={styles.image}
                    />
                    <Text style={styles.addText}>
                        <Text style={{ fontWeight: 'bold', color: 'rgba(5, 49, 92, 1)' }}>
                            {index + 1}
                        </Text>{' '}
                        / {subcategories.length}
                    </Text>
                </View>
            );

            // أضف إعلانًا بعد كل صورتين
            if ((index + 1) % 2 === 0 && index < subcategories.length - 1) {
                itemsWithAds.push(
                    <View key={`ad-${index}`} style={styles.itemContainer}>
                        <View style={styles.adContainer}>
                            <ADAPTIVEbanner />
                        </View>
                    </View>
                );
            }
        });
        return itemsWithAds;
    };

    const renderPaginationDots = () => {
        return (
            <View style={styles.pagination}>
                {subcategories.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                snapToInterval={SCREEN_WIDTH * 0.8}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: SCREEN_WIDTH * 0.1 }}
                onMomentumScrollEnd={handleScrollEnd}
            >
                {renderItemsWithAds()}
            </ScrollView>
            <View style={styles.pagination}>{renderPaginationDots()}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 700,
    },
    itemContainer: {
        width: SCREEN_WIDTH * 0.75, // العرض أقل من الشاشة
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: SCREEN_WIDTH * 0.025, // تباعد بين العناصر
        borderRadius: 20,
        overflow: 'hidden',
    },
    image: {
        width: '100%', // تناسب العرض
        height: '90%',
        borderRadius: 20,
    },
    addText: {
        color: '#5A5A5B',
        marginTop: 10,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Inter-Bold',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'rgba(5, 49, 92, 1)',
    },
    inactiveDot: {
        backgroundColor: '#ccc',
    },
    adContainer: {
        width: '100%',
        height: '85%',
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CarouselComponent;