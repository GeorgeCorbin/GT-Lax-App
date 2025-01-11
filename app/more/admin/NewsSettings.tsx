import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const NewsSettings: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>News Settings</Text>
            {/* Add your components and logic here */}
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
});

export default NewsSettings;