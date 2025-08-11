import React, { createContext, useState, useContext, useEffect } from 'react';
import mobileAds, { AdEventType, InterstitialAd, AppOpenAd } from 'react-native-google-mobile-ads';
import { adUnitIdAppOpen, adUnitIdInterstitial } from '../../env';

const AdsContext = createContext();

export const AdsProvider = ({ children }) => {
  const [isMobileAdsStartCalled, setMobileAdsStartCalled] = useState(false);
  const [interstitial, setInterstitial] = useState(null);
  const [interstitialIsLoaded, setInterstitialLoaded] = useState(false);
  const [appOpenAd, setAppOpenAd] = useState(null);
  const [appOpenAdIsLoaded, setAppOpenAdLoaded] = useState(false);
  const [adShownOnce, setAdShownOnce] = useState(false);

  // دالة لتحميل الإعلانات دون استخدام AdsConsent
  const loadAds = () => {
    // إعلان Interstitial:
    const interstitialAd = InterstitialAd.createForAdRequest(adUnitIdInterstitial, {
      // يتم دائمًا طلب إعلانات شخصية هنا
      requestNonPersonalizedAdsOnly: false,
    });

    interstitialAd.load();

    // مستمع لتحميل الإعلان
    const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });

    // مستمع لإغلاق الإعلان لإعادة تحميل إعلان جديد
    const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      interstitialAd.load();
    });

    // مستمع للأخطاء في حال فشل تحميل الإعلان
    const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('فشل تحميل الإعلان', error);
      setInterstitialLoaded(false);
    });

    setInterstitial(interstitialAd);

    // إعلان App Open:
    const appOpen = AppOpenAd.createForAdRequest(adUnitIdAppOpen, {
      requestNonPersonalizedAdsOnly: false,
    });

    appOpen.load();

    const unsubscribeAppOpenLoaded = appOpen.addAdEventListener(AdEventType.LOADED, () => {
      setAppOpenAdLoaded(true);
    });

    const unsubscribeAppOpenClosed = appOpen.addAdEventListener(AdEventType.CLOSED, () => {
      setAppOpenAdLoaded(false);
      appOpen.load();
    });

    const unsubscribeAppOpenError = appOpen.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('فشل تحميل إعلان App Open', error);
      setAppOpenAdLoaded(false);
    });

    setAppOpenAd(appOpen);

    // إرجاع دوال التنظيف (في حال احتجت لإلغاء الاشتراكات لاحقًا)
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
      unsubscribeAppOpenLoaded();
      unsubscribeAppOpenClosed();
      unsubscribeAppOpenError();
    };
  };

  // استخدام useEffect لتهيئة SDK وتحميل الإعلانات مباشرة
  useEffect(() => {
    const startGoogleMobileAdsSDK = async () => {
      if (isMobileAdsStartCalled) return;
      setMobileAdsStartCalled(true);
      // تهيئة Google Mobile Ads SDK
      await mobileAds().initialize();
      // بعد التهيئة يتم تحميل الإعلانات
      loadAds();
    };

    startGoogleMobileAdsSDK();
  }, [isMobileAdsStartCalled]);

  return (
    <AdsContext.Provider
      value={{
        interstitial,
        interstitialIsLoaded,
        appOpenAd,
        appOpenAdIsLoaded,
        adShownOnce,
        setAdShownOnce,
      }}
    >
      {children}
    </AdsContext.Provider>
  );
};

export const useAds = () => useContext(AdsContext);
