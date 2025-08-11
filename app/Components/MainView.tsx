import { RefreshControl, ScrollView, StyleSheet,Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const height = Dimensions.get('window').height

const MainView = ({ children, onRefresh, refreshing }: any) => {
    return (
        <SafeAreaView style={{ flex: 1,backgroundColor: '#000' }}>
            <ScrollView
                contentContainerStyle={styles.scrollStyle}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    ) : undefined
                }
            >
                <LinearGradient colors={['#0D0D0D', '#223263']} style={styles.background}>
                    {children}
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MainView;

const styles = StyleSheet.create({
    scrollStyle: {
        flexGrow: 1,
        
    },
    background: {
        flex: 1,
    },
});
