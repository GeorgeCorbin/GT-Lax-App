import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const AddStoreItem = () => {
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemDescription, setItemDescription] = useState('');

    const handleAddItem = () => {
        // Logic to add the item to the store
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add Store Item</Text>
            <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={itemName}
                onChangeText={setItemName}
            />
            <TextInput
                style={styles.input}
                placeholder="Item Price"
                value={itemPrice}
                onChangeText={setItemPrice}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Item Description"
                value={itemDescription}
                onChangeText={setItemDescription}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleAddItem}>
                <Text style={styles.buttonText}>Add Item</Text>
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
    input: {
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
        color: Colors.black,
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

export default AddStoreItem;