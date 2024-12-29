import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MoreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More Page</Text>
    </View>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
