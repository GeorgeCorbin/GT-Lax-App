import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '@/constants/styles/admin';

const AdminPanel = () => {
    const handleAction = (action: string) => {
        alert(`${action} clicked`);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Admin Panel</Text>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => handleAction('Push Notifications')}
            >
                <Text style={styles.panelButtonText}>Push Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => handleAction('Toggle Store')}
            >
                <Text style={styles.panelButtonText}>Toggle Store</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => handleAction('Add Store Item')}
            >
                <Text style={styles.panelButtonText}>Add Store Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => handleAction('Post Article')}
            >
                <Text style={styles.panelButtonText}>Post Article</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => handleAction('Upload Roster')}
            >
                <Text style={styles.panelButtonText}>Upload Roster</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => handleAction('Upload Player Images')}
            >
                <Text style={styles.panelButtonText}>Upload Player Images</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => handleAction('Manage Bios')}
            >
                <Text style={styles.panelButtonText}>Manage Bios</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AdminPanel;
