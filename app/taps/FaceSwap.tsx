import { StyleSheet } from 'react-native';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import Header from '../Components/Header';
import ListImags from '../Components/FaceSwapComponents/ListImags';
import Loading from '../Components/Loading';
import { useNavigation } from '@react-navigation/native';
import { ApiContext } from '../Context/ApiContext';
import MainView from '../Components/MainView';

const FaceSwap = () => {
    const { getCategories, categoriesData, loading } = useContext<any>(ApiContext);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<any>();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getCategories().then(() => setRefreshing(false));
    }, []);

    return (
        <MainView onRefresh={onRefresh} refreshing={refreshing}>
            <Header Title="FaceSwap" />
            {loading ?
                <Loading />
                :
                <ListImags navigation={navigation} categories={categoriesData} />
            }
        </MainView>
    );
};

export default FaceSwap;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
});
