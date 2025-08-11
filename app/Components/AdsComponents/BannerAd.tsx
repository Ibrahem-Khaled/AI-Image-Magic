import React from 'react'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adUnitIdBanner } from '../../../env';

const BannerAds = () => {
    return (
        <BannerAd
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            unitId={adUnitIdBanner}
            onAdLoaded={() => {
                console.log('Advert loaded');
            }}
            onAdFailedToLoad={error => {
                console.error('Advert failed to load: ', error);
            }}
        />
    )
}

export default BannerAds