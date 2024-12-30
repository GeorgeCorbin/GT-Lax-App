import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const ShopScreen: React.FC = () => {
  const handleRefresh = () => {
    // Logic to refresh the shop
    console.log('Refresh button pressed');
  };

  return (
    <AnimatedHeaderLayout headerText="Shop" backgroundColor={styles.container.backgroundColor}>
      <View style={styles.container}>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.messageContainer}>
          <Text style={styles.soldOutMessage}>We are all sold out</Text>
          <Text style={styles.subMessage}>
            Come back at a later time to get your official Georgia Tech Lacrosse merch.
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </AnimatedHeaderLayout>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background, // Navy blue background
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',    
    },
    title: {
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors.textTitle, // White text
      marginBottom: 40,
    },
    messageContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    soldOutMessage: {
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.textPrimary, // White text
      marginBottom: 10,
    },
    subMessage: {
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      fontSize: 16,
      color: Colors.textSecondary, // Light gray text
      textAlign: 'center',
    },
    refreshButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: Colors.buttonPrimary.background, // Gold color for button
      borderRadius: 5,
    },
    refreshText: {
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.buttonPrimary.text, // Black text
    },
  });

export default ShopScreen;