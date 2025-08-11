import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from './screens/GetStarted';
import Taps from './taps/Taps';
import { DrawerContext, DrawerProvider } from './Context/DrawerContext';
import CustomDrawer from './Components/Drawer';
import { StatusBar } from 'expo-status-bar';
import SubCategory from './screens/SubCategory';
import FaceSwapGenerate from './screens/FaceSwapGenerate';
import TextToImageSetting from './screens/TextToImageSetting';
import ShowAllThemes from './screens/ShowAllThemes';
import MembershipScreen from './screens/MembershipScreen';
import BannerAds from './Components/AdsComponents/BannerAd';
import FinalImageGenerated from './screens/FinalImageGenerated';

const Stack = createNativeStackNavigator();

function StackNavigator() {
    return (
        <Stack.Navigator initialRouteName="GetStarted" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="GetStarted" component={GetStarted} />
            <Stack.Screen name="Taps" component={Taps} />

            <Stack.Screen name="subCategory" component={SubCategory} />
            <Stack.Screen name="FaceSwapGenerate" component={FaceSwapGenerate} />

            <Stack.Screen name='TextToImageSetting' component={TextToImageSetting} />
            <Stack.Screen name='ShowAllThemes' component={ShowAllThemes} />
            <Stack.Screen name='ManagePlan' component={MembershipScreen} />

            <Stack.Screen name='GeneratedImage' component={FinalImageGenerated} />
        </Stack.Navigator>
    );
}

const IndexNav = () => {
    return (
        <DrawerProvider>
            <NavigationContainer>
                <StatusBar style="light" backgroundColor='#0D0D0D' />
                <AppContent />
                <BannerAds />
            </NavigationContainer>
        </DrawerProvider>
    );
};

const AppContent = () => {
    const { isDrawerOpen, closeDrawer } = useContext<any>(DrawerContext);

    return (
        <>
            <CustomDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
            <StackNavigator />
        </>
    );
};

export default IndexNav;
