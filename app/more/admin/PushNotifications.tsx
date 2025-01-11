import Colors from '@/constants/Colors';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PushNotifications = () => {
    const sendNotification = () => {
        alert('Push notification sent!');
        // Implement push notification logic here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Push Notifications</Text>
            <Text style={styles.description}>
                Use this page to send push notifications to all users.
            </Text>
            <Button title="Send Notification" onPress={sendNotification} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    header: {
        fontSize: 24, fontWeight: 'bold', marginBottom: 20,
        fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3.84,
    },
    description: { fontSize: 16, marginBottom: 20 },
});

export default PushNotifications;
