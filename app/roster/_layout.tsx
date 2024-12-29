import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { StyleSheet, StatusBar, View } from 'react-native';
import React from 'react';

export default function RosterLayout() {
  return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        {/* Container with top padding for space buffer */}
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Roster' }} />
            <Stack.Screen name="PlayerBio" options={{ title: 'PlayerBio' }} />
          </Stack>
        </View>
      </>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
