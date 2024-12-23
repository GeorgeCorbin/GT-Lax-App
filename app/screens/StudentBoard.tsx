import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudentBoard: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student Board</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
});

export default StudentBoard;