import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const GetStarted = () => {
    const navigation = useNavigation<any>();
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <Image
                        source={require('../images/started.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={styles.text}>
                        Transform your concepts into tangible outcomes.
                    </Text>

                    <Button
                        mode="contained"
                        style={styles.button}
                        textColor="white"
                        labelStyle={styles.buttonLabel}
                        onPress={() => navigation.navigate("Taps")}
                    >
                        Get Started
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GetStarted

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    scrollViewContainer: {
        height: "100%",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24, // px-6 equivalent
    },
    image: {
        maxWidth: 375,
        width: '100%',
        height: 390,
    },
    text: {
        marginTop: 44, // mt-11 equivalent
        fontSize: 34,
        textAlign: 'center',
        color: '#FFFFFF', // default to white for dark mode
        fontFamily: 'Inter-Regular', // assuming 'font-iregular' is custom font
    },
    button: {
        width: '100%',
        height: 48, // h-12 equivalent
        marginTop: 48, // mt-12 equivalent
        justifyContent: 'center',
        borderRadius: 50, // rounded-full equivalent
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: '500',
    },
});
