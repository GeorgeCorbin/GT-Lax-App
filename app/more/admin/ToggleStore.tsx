import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

const ToggleStore = () => {
    const handleToggle = () => {
        // Logic to toggle store
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Toggle Store</Text>
            <TouchableOpacity style={styles.button} onPress={handleToggle}>
                <Text style={styles.buttonText}>Toggle Store</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.techGold,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: Colors.techGold,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ToggleStore;