import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RosterScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Roster</Text>
      {/* Add dynamic sections for lacrosse positions */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E2952' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', margin: 20 },
});
