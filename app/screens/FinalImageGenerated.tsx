import { Dimensions, Share, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import React, { useContext, useState } from 'react';
import MainView from '../Components/MainView';
import Header from '../Components/Header';
import { ApiContext } from '../Context/ApiContext';
import { Image } from 'expo-image';
import { blurhash } from '../../env';
import Icon from '@expo/vector-icons/MaterialIcons';
import { RadioButton } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const FinalImageGenerated = ({ route }: any) => {
    const { saveImageFromGallery } = useContext<any>(ApiContext);
    const { image: generatedImage } = route.params;
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isReported, setIsReported] = useState(false);

    const handelSharing = () => {
        const appLink = generatedImage;
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

    const handleReport = () => {
        setIsReportModalVisible(true);
    };

    const submitReport = () => {
        // هنا يمكنك إرسال سبب الريبورت إلى الخادم أو القيام بأي إجراء آخر
        console.log('Report Reason:', reportReason);
        setIsReported(true);
        setIsReportModalVisible(false);
    };

    return (
        <MainView>
            <Header IsBack Title='Image Generated' />
            {generatedImage && (
                <View style={styles.imageContainer}>
                    <Image
                        placeholder={{ blurhash }}
                        contentFit="contain"
                        transition={1000}
                        source={{ uri: generatedImage }}
                        style={styles.generatedImage}
                    />
                    {!isReported && (
                        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
                            <Icon name="report" size={24} color="#ff0000" />
                        </TouchableOpacity>
                    )}
                </View>
            )}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    onPress={() => saveImageFromGallery(generatedImage)}
                    style={[styles.button, styles.saveButton]}
                >
                    <Icon name="save-alt" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Save Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handelSharing}
                    style={[styles.button, styles.shareButton]}
                >
                    <Icon name="share" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Share Image</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isReportModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsReportModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Report Image / Feedback</Text>

                        <View style={styles.radioButtonContainer}>
                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => setReportReason('spam')}
                            >
                                <RadioButton
                                    value="spam"
                                    status={reportReason === 'spam' ? 'checked' : 'unchecked'}
                                    color="#4CAF50"
                                />
                                <Text style={styles.radioButtonText}>Result is not accurate</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => setReportReason('inappropriate')}
                            >
                                <RadioButton
                                    value="inappropriate"
                                    status={reportReason === 'inappropriate' ? 'checked' : 'unchecked'}
                                    color="#4CAF50"
                                />
                                <Text style={styles.radioButtonText}>Inappropriate Content</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => setReportReason('other')}
                            >
                                <RadioButton
                                    value="other"
                                    status={reportReason === 'other' ? 'checked' : 'unchecked'}
                                    color="#4CAF50"
                                />
                                <Text style={styles.radioButtonText}>Other</Text>
                            </TouchableOpacity> */}
                        </View>

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                onPress={() => setIsReportModalVisible(false)}
                                style={[styles.modalButton, styles.closeButton]}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={submitReport}
                                style={[styles.modalButton, styles.submitButton]}
                            >
                                <Text style={styles.modalButtonText}>Submit Report</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </MainView>
    );
};

export default FinalImageGenerated;

const styles = StyleSheet.create({
    imageContainer: {
        position: 'relative',
    },
    generatedImage: {
        width: width - 10,
        height: height - 200,
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: 'center',
    },
    reportButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 20,
        padding: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '45%',
        borderWidth: 1,
        borderColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#223263',
    },
    shareButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#999',
        textAlign: 'center',
    },
    radioButtonContainer: {
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    radioButtonText: {
        fontSize: 16,
        color: '#f5f5f5',
        marginLeft: 10,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    closeButton: {
        backgroundColor: '#ff4444',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});