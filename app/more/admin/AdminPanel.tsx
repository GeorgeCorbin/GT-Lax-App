import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import styles from '@/constants/styles/admin';

const AdminPanel = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Admin Panel</Text>

            <TouchableOpacity style={styles.panelButton}>
                <Link href="/more/admin/PushNotifications" style={styles.panelButtonText}>
                    Push Notifications
                </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton}>
                <Link href="/more/admin/ToggleStore" style={styles.panelButtonText}>
                    Toggle Store
                </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton}>
                <Link href="/more/admin/AddStoreItem" style={styles.panelButtonText}>
                    Add Store Item
                </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton}>
                <Link href="/more/admin/NewsSettings" style={styles.panelButtonText}>
                    News Settings
                </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton}>
                <Link href="/more/admin/UploadRoster" style={styles.panelButtonText}>
                    Upload Roster
                </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton}>
                <Link href="/more/admin/UploadPlayerImages" style={styles.panelButtonText}>
                    Upload Player Images
                </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton}>
                <Link href="/more/admin/ManageBios" style={styles.panelButtonText}>
                    Manage Bios
                </Link>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AdminPanel;
