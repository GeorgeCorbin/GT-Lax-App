import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function MoreScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>More</Text>
      {/* Add links to seasons, social media, and contacts */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E2952' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', margin: 20 },
});
