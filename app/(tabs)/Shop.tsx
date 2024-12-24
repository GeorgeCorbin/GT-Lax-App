import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import styles from '../../constants/styles/shop'; // Updated path for styles
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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

export default ShopScreen;