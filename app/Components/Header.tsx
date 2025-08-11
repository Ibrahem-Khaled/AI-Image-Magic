import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerContext } from '../Context/DrawerContext';
import { useNavigation } from '@react-navigation/native';
import { ApiContext } from '../Context/ApiContext';
import { LinearGradient } from 'expo-linear-gradient';

const Header = ({ Title, IsBack = false, HidePlan = false }: { Title: string; IsBack?: boolean; HidePlan?: boolean }) => {
    const { openDrawer } = useContext<any>(DrawerContext);
    const navigation = useNavigation<any>();
    const { currentUserPlan } = useContext<any>(ApiContext);

    return (
        <View style={styles.container}>
            {!IsBack ?
                <TouchableOpacity onPress={openDrawer}>
                    <Entypo name="menu" size={28} color="#fff" />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-sharp" size={28} color="#fff" />
                </TouchableOpacity>
            }
            <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', color: '#fff' }}>{Title}</Text>
            {!HidePlan && (
                <LinearGradient
                    colors={['#FFD700', '#FFAA00']}
                    style={styles.planContainer}>
                    <MaterialIcons name="workspace-premium" size={20} color="#2C2C2C" />
                    <View style={styles.separator} />
                    <View style={styles.usageContainer}>
                        <Text style={styles.planText}>
                            <Text style={styles.boldText}>{ currentUserPlan.DailyUsage}</Text>
                            <Text>/{currentUserPlan.MaxImagesPerDay}</Text>
                        </Text>
                        <Text style={styles.planSubText}>Today's Usage</Text>
                    </View>
                    {/* <View style={styles.separator} />
                    <Text style={styles.planType}>Premium Plan</Text> */}
                </LinearGradient>
            )}
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    planContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFC721',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    planIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    planTextContainer: {
        alignItems: 'center',
    },
    planText: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'Inter-Medium',
    },
    planDetails: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter-Bold',
    },

    separator: {
        height: 20,
        width: 1,
        backgroundColor: 'rgba(44,44,44,0.3)',
        marginHorizontal: 10,
    },
    usageContainer: {
        alignItems: 'center',
    },
    boldText: {
        fontFamily: 'Inter-ExtraBold',
        fontSize: 16,
    },
    planSubText: {
        color: '#2C2C2C',
        fontSize: 10,
        fontFamily: 'Inter-Medium',
        marginTop: -2,
    },
    planType: {
        color: '#2C2C2C',
        fontSize: 12,
        fontFamily: 'Inter-SemiBold',
        marginLeft: 5,
    },
});