import axios from "axios";
import * as Device from 'expo-device';
import { TestIds } from "react-native-google-mobile-ads";
import { Platform } from 'react-native';
import { Text, StyleSheet } from "react-native";


export const baseUrl = 'https://www.api.photobox.website';
export const apiKey = '123@123';
export const deviceUuid = Device.osBuildId;
export const platform = Platform.OS;
export const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'x-api-key': apiKey,
    },
});

export default axiosInstance;

export const adUnitIdBanner = __DEV__ ? TestIds.BANNER : (platform === 'ios' ? 'ca-app-pub-4685700669316053/1576677296' : 'ca-app-pub-4685700669316053/9068154505');
export const adUnitIdInterstitial = __DEV__ ? TestIds.INTERSTITIAL : (platform === 'ios' ? 'ca-app-pub-4685700669316053/6394191022' : 'ca-app-pub-4685700669316053/6502002233');
export const adUnitIdAppOpen = __DEV__ ? TestIds.APP_OPEN : (platform === 'ios' ? 'ca-app-pub-4685700669316053/5885757278' : 'ca-app-pub-4685700669316053/2694317842');
export const adUnitIdBannerAdaptive = __DEV__ ? TestIds.ADAPTIVE_BANNER : (platform === 'ios' ? 'ca-app-pub-4685700669316053/6394191022' : 'ca-app-pub-4685700669316053/6502002233');

export const PrivacyPolicy = ({ style }) => (
    <Text style={style}>
        <Text style={styles.sectionTitle}>Privacy Policy{"\n\n"}</Text>

        <Text style={styles.boldText}>Photobox</Text> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect the information you provide when using our AI image editing app with face swap and image generation functions (the "App").{"\n\n"}

        <Text style={styles.sectionSubtitle}>1. Information We Collect{"\n"}</Text>
        We may collect the following types of information:{"\n"}
        • Images and Data Submitted by Users{"\n"}
        • Device and Usage Data{"\n"}
        • Optional Feedback Data{"\n\n"}

        <Text style={styles.sectionSubtitle}>2. How We Use Your Data{"\n"}</Text>
        • Process face swaps and generate AI-based images{"\n"}
        • Enhance app performance{"\n"}
        • Provide customer support{"\n\n"}

        <Text style={styles.sectionSubtitle}>3. Data Security{"\n"}</Text>
        • Local storage on your device{"\n"}
        • Encrypted server transmission{"\n"}
        • Immediate data deletion after processing{"\n\n"}

        <Text style={styles.sectionSubtitle}>4. Third-Party Services{"\n"}</Text>
        • Cloud processing (when needed){"\n"}
        • Analytics tools{"\n\n"}

        <Text style={styles.sectionSubtitle}>5. Your Rights{"\n"}</Text>
        • Access and delete your data{"\n"}
        • Opt-out of analytics{"\n\n"}

        <Text style={styles.contactText}>
            Contact us at:{"\n"}
            <Text style={styles.email}>CobraClip@gmail.com</Text>
        </Text>
    </Text>
);

export const TermsOfService = ({ style }) => (
    <Text style={style}>
        <Text style={styles.sectionTitle}>Terms of Service{"\n\n"}</Text>

        By downloading or using the App, you agree to these Terms.{"\n\n"}

        <Text style={styles.sectionSubtitle}>1. App Usage{"\n"}</Text>
        • Personal use only{"\n"}
        • Minimum age: 13 years{"\n"}
        • Compliance with laws{"\n\n"}

        <Text style={styles.sectionSubtitle}>2. Content Rules{"\n"}</Text>
        • You retain ownership{"\n"}
        • Prohibited content:{"\n"}
        &nbsp;&nbsp;- Copyright violations{"\n"}
        &nbsp;&nbsp;- Illegal/offensive material{"\n\n"}

        <Text style={styles.sectionSubtitle}>3. Intellectual Property{"\n"}</Text>
        • App rights reserved by TechView{"\n"}
        • No reverse engineering{"\n\n"}

        <Text style={styles.sectionSubtitle}>4. Liability{"\n"}</Text>
        • "As is" service{"\n"}
        • No warranty for uninterrupted use{"\n\n"}

        <Text style={styles.contactText}>
            Updates to these terms will be posted in-app.{"\n\n"}
            Contact:{"\n"}
            <Text style={styles.email}>CobraClip@gmail.com</Text>
        </Text>
    </Text>
);

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
    },
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8A2BE2',
        marginVertical: 10,
    },
    boldText: {
        fontWeight: '600',
        color: '#2c3e50',
    },
    contactText: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
    },
    email: {
        color: '#3498db',
        textDecorationLine: 'underline',
    },

});