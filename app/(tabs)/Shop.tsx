import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shop</Text>
      <Text style={styles.message}>We are all sold out. Check back later for merchandise!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E2952' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  message: { fontSize: 16, color: '#fff', marginTop: 20 },
});
