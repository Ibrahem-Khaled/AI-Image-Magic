import React from 'react'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { adUnitIdBannerAdaptive } from '../../../env';

const ADAPTIVEbanner = ({ Size = null }) => {
    return (
        <BannerAd
            unitId={adUnitIdBannerAdaptive}
            size={Size || BannerAdSize.MEDIUM_RECTANGLE}
            requestOptions={{
                networkExtras: {
                    collapsible: 'bottom',
                },
            }}
        />
    )
}

export default ADAPTIVEbanner
