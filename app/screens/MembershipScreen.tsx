import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Components/Header';

const MembershipScreen = () => {
    const [selectedPlan, setSelectedPlan] = useState('plan2');

    const plans = [
        {
            id: 'plan1',
            price: '$20.49',
            description: '3 months, cancel anytime.',
        },
        {
            id: 'plan2',
            price: '$35.00',
            description: '6 months, one time.',
            badge: 'Save $5',
        },
        {
            id: 'plan3',
            price: '$79.49',
            description: 'Yearly, cancel anytime.',
            badge: 'Popular',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Header Title="Membership" HidePlan IsBack />

            <Text style={styles.subtext}>
                One simple membership,
                many benefits. Join now.
            </Text>

            {/* Membership Plans */}
            <View style={{paddingHorizontal: 10}}>
                {plans.map((plan) => (
                    <TouchableOpacity
                        key={plan.id}
                        style={[
                            styles.planContainer,
                            selectedPlan === plan.id && styles.selectedPlan,
                        ]}
                        onPress={() => setSelectedPlan(plan.id)}
                    >
                        <View style={styles.radioContainer}>
                            <RadioButton
                                value={plan.id}
                                status={selectedPlan === plan.id ? 'checked' : 'unchecked'}
                                onPress={() => setSelectedPlan(plan.id)}
                                color="#4A90E2"
                                uncheckedColor="#4A90E2"
                            />
                        </View>
                        <View style={styles.planDetails}>
                            <Text style={styles.planPrice}>{plan.price}</Text>
                            {plan.badge && (
                                <Text style={[styles.badge, styles[plan.badge.toLowerCase()]]}>
                                    {plan.badge}
                                </Text>
                            )}
                            <Text style={styles.planDescription}>{plan.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Join Button */}
            <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default MembershipScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    subtext: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        margin: 20,
        width: '50%',
        alignSelf: 'center',
    },
    planContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    selectedPlan: {
        borderColor: '#3971F3',
        borderWidth: 1,
        backgroundColor: '#111', 
        borderLeftWidth: 5,
        overflow: 'hidden',
    },
    radioContainer: {
        marginRight: 10,
    },
    planDetails: {
        flex: 1,
    },
    planPrice: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    badge: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
        backgroundColor: '#4A90E2',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginVertical: 5,
    },
    save: {
        backgroundColor: '#4A90E2',
    },
    popular: {
        backgroundColor: '#FF6347',
    },
    planDescription: {
        fontSize: 14,
        color: '#aaa',
    },
    joinButton: {
        backgroundColor: '#3971F3',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        margin: 20,
        width: '80%',
        alignSelf: 'center',
    },
    joinButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
