import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { StyleSheet, StatusBar, View } from 'react-native';
import React from 'react';

export default function MoreLayout() {
  return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        {/* Container with top padding for space buffer */}
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'More' }} />
            <Stack.Screen name="OldSeason" options={{ title: 'OldSeason' }} />
            <Stack.Screen name="StudentBoard" options={{ title: 'Student Board' }} />
            <Stack.Screen name="CoachingStaff" options={{ title: 'Coaching Staff' }} />
            <Stack.Screen name="AdminPage" options={{ title: 'Admin Only' }} />
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
