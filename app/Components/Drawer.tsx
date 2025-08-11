import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, View, Text, TouchableOpacity, Modal, StyleSheet, Image, Platform, Share, Linking, ScrollView } from 'react-native';
import { PrivacyPolicy, TermsOfService } from '../../env';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';

const CustomDrawer = ({ isOpen, onClose, drawerPosition = 'left', drawerWidth = 350 }) => {
    const translateX = useRef(new Animated.Value(drawerPosition === 'left' ? -drawerWidth : SCREEN_WIDTH)).current;
    const navigation = useNavigation<any>();
    const [showContentModal, setShowContentModal] = useState(false);
    const [contentToShow, setContentToShow] = useState('');

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isOpen ? 0 : (drawerPosition === 'left' ? -drawerWidth : SCREEN_WIDTH),
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOpen]);

    const handelSharing = () => {
        const appLink =
            IS_IOS
                ? 'https://apps.apple.com/app/your-app-id'
                : 'https://play.google.com/store/apps/details?id=com.ebrahem_khaled3.photoBox';

        Share.share({
            message: `Check out this app: ${appLink}`,
            url: appLink,
            title: 'Share App',
        })
            .then((result) => {
                if (result.action === Share.sharedAction) {
                    console.log('Link shared successfully');
                } else if (result.action === Share.dismissedAction) {
                    console.log('Share dismissed');
                }
            })
            .catch((error) => console.error('Error sharing', error));
    };

    const handelRateUs = () => {
        // تحديد الرابط حسب المنصة
        const appLink =
            IS_IOS
                ? 'itms-apps://apps.apple.com/app/idYOUR_APP_ID?action=write-review'
                : 'market://details?id=com.ebrahem_khaled3.photoBox';

        Linking.openURL(appLink).catch((error) => {
            console.error('Error opening rating link:', error);
        });
    };

    const handleContentModal = (contentType: string) => {
        setContentToShow(contentType);
        setShowContentModal(true);
    };

    const renderModalContent = () => {
        const content = {
            terms: {
                title: 'Terms & Conditions',
                component: <TermsOfService style={styles.modalText} />
            },
            privacy: {
                title: 'Privacy Policy',
                component: <PrivacyPolicy style={styles.modalText} />
            }
        }[contentToShow];

        return (
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{content?.title}</Text>
                    <TouchableOpacity onPress={() => setShowContentModal(false)}>
                        <MaterialIcons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalBody}>
                    {content?.component}
                    <View style={styles.decorativeBox}>
                        <MaterialIcons name="verified-user" size={40} color="#8A2BE2" />
                        <Text style={styles.decorativeText}>Your Security is Our Priority</Text>
                    </View>
                </ScrollView>
            </View>
        );
    };

    return (
        <>
            {isOpen && (
                <TouchableOpacity style={styles.overlay} onPress={onClose} />
            )}

            <Animated.View
                style={[
                    styles.drawer,
                    {
                        width: drawerWidth,
                        transform: [{ translateX }],
                        left: drawerPosition === 'left' ? 0 : null,
                        right: drawerPosition === 'right' ? 0 : null,
                    },
                ]}
            >
                <View style={styles.drawerContent}>

                    {/* <TouchableOpacity onPress={() => navigation.navigate('ManagePlan')} style={[styles.drawerItem, styles.managePlan]}>
                        <MaterialIcons name="diamond" size={24} color="white" />
                        <Text style={styles.drawerItemText}>Manage Plan</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.drawerItem} onPress={handelSharing}>
                        <Image
                            source={require('../images/icons/share-icon.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.drawerItemText}>Share</Text>
                    </TouchableOpacity>



                    <TouchableOpacity style={styles.drawerItem} onPress={handelRateUs}>
                        <Image
                            source={require('../images/icons/rate_us-icon.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.drawerItemText}>Rate Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem}
                        onPress={() => handleContentModal('terms')}>
                        <Image
                            source={require('../images/icons/terms_conditions-icon.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.drawerItemText}>Terms & Conditions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.drawerItem}
                        onPress={() => handleContentModal('privacy')}>
                        <Image
                            source={require('../images/icons/privacy-icon.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.drawerItemText}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <Modal visible={showContentModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    {renderModalContent()}
                </View>
            </Modal>
        </>
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 1000,
    },
    drawerContent: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // خلفية شفافة داكنة
        zIndex: 999, // تأكد من أنها فوق المحتوى
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10,
    },
    drawerItemText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 15,
    },
    managePlan: {
        backgroundColor: '#8A2BE2',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#3498db',
        borderRadius: 5,
        margin: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 15,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalBody: {
        paddingHorizontal: 5,
    },
    modalText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 20,
    },
    decorativeBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginVertical: 10,
    },
    decorativeText: {
        color: '#8A2BE2',
        fontWeight: '600',
        marginTop: 10,
        textAlign: 'center',
    },

});
