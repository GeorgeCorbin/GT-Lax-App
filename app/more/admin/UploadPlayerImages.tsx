import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const UploadPlayerImages: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Upload Player Images</Text>
            {/* Add your component code here */}
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

export default UploadPlayerImages;