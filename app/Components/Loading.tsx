import React, { useRef } from 'react'
import LottieView from 'lottie-react-native';
import ADAPTIVEbanner from './AdsComponents/ADAPTIVEbanner';
import { View } from 'react-native';

const Loading = () => {
    const animation = useRef<LottieView>(null);

    return (
        <View style={{ flex: 1,alignItems: 'center', justifyContent: 'space-around' }}>
            <LottieView
                autoPlay
                loop
                ref={animation}
                style={{
                    width: 200,
                    height: 200,
                    alignSelf: 'center',
                }}
                source={require('../../assets/Loader.json')}
            />
            <ADAPTIVEbanner />
        </View>
    )
}

export default Loading