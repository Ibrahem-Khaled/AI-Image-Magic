import * as React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FaceSwap from './FaceSwap';
import ImagineScreen from './TextFromImg';

import faceSwapIcon from '../images/icons/face-swap-icon.png';
import imgFromTxtIcon from '../images/icons/img-form-txt-icon.png';

const Tab = createBottomTabNavigator();

export default function Taps() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#0D0D0D', borderTopWidth: 0 },
                tabBarLabelStyle: { color: 'white', fontSize: 10, fontFamily: 'Inter-Regular' },
                tabBarActiveTintColor: 'white', 
                tabBarInactiveTintColor: 'gray',
                tabBarHideOnKeyboard: true
            }}
            
        >
            <Tab.Screen
                name="FaceSwap"
                options={{
                    tabBarLabel: 'Face Swap',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={faceSwapIcon}
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                }}
                component={FaceSwap}
            />
            <Tab.Screen
                name="ImgFromTxt"
                options={{
                    tabBarLabel: 'Generate',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={imgFromTxtIcon}
                            resizeMode='contain'
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                }}
                component={ImagineScreen}
            />
        </Tab.Navigator>
    );
}
