import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const PushNotifications = () => {
    const [isLoading, setIsLoading] = useState(false);

    const sendManualNotification = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://us-central1-gt-lax-app.cloudfunctions.net/sendPushNotification",
                { 
                    title: "🧪 Test Notification",
                    body: "This is a manual test notification from the admin panel!"
                },
                { headers: { "Content-Type": "application/json" } }
            );
            Alert.alert("Success", "Manual notification sent successfully!");
            console.log("Manual notification sent:", response.data);
        } catch (error) {
            console.error("Error sending manual notification:", error);
            Alert.alert("Error", "Failed to send manual notification");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Push Notifications</Text>
            <Text style={styles.description}>
                Use this page to test push notifications to all users.
            </Text>
            
            <View style={styles.buttonContainer}>
                <Text style={styles.sectionTitle}>Manual Notification</Text>
                <Text style={styles.sectionDescription}>
                    Send a manual test notification with fixed content.
                </Text>
                <Button 
                    title={isLoading ? "Sending..." : "Send Manual Notification"} 
                    onPress={sendManualNotification}
                    disabled={isLoading}
                />
            </View>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.techGold} />
                    <Text style={styles.loadingText}>Sending notification...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: Colors.background 
    },
    header: {
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20,
        fontFamily: 'roboto-regular-bold',
        color: Colors.textTitle,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3.84,
    },
    description: { 
        fontSize: 16, 
        marginBottom: 30,
        color: Colors.textPrimary,
        fontFamily: 'roboto-regular',
    },
    buttonContainer: {
        marginBottom: 30,
        padding: 15,
        backgroundColor: Colors.techGold,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.diploma,
        fontFamily: 'roboto-bold',
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 15,
        color: Colors.diploma,
        fontFamily: 'roboto-regular',
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.textPrimary,
        fontFamily: 'roboto-regular',
    },
});

export default PushNotifications;
