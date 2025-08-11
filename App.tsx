import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import IndexNav from './app/indexNav';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ApiProvider from './app/Context/ApiContext';
import { StatusBar } from 'expo-status-bar';
import { AdsProvider, useAds } from './app/Context/AdsContext';
import AdsUserConsent from './app/Components/AdsComponents/AdsUserConsent';

function MainApp() {
  const { appOpenAd, appOpenAdIsLoaded, adShownOnce, setAdShownOnce } = useAds();

  // استدعاء useFonts دائمًا بنفس الترتيب
  const [loaded, error] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
  });

  useEffect(() => {
    if (appOpenAdIsLoaded && appOpenAd && !adShownOnce) {
      appOpenAd.show();
      setAdShownOnce(true);
    }
  }, [appOpenAdIsLoaded, appOpenAd, adShownOnce, setAdShownOnce]);

  // التحقق من الحالة يجب أن يتم بعد استدعاء جميع الـ Hooks
  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#000" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <IndexNav />
      </GestureHandlerRootView>
    </>
  );
}

export default function App() {
  return (
    <AdsProvider>
      <ApiProvider>
        <AdsUserConsent />
        <MainApp />
      </ApiProvider>
    </AdsProvider>
  );
}
