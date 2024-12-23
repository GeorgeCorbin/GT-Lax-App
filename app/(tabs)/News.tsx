import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

export default function NewsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>News</Text>
      {/* Replace with dynamic data */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E2952' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', margin: 20 },
});
