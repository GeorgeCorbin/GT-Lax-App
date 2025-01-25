import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { StyleSheet, StatusBar, View } from 'react-native';
import React from 'react';

export default function MoreLayout() {
  return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        {/* Container with top padding for space buffer */}
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'More' }} />
            <Stack.Screen name="StudentBoard" options={{ title: 'Student Board' }} />
            <Stack.Screen name="CoachingStaff" options={{ title: 'Coaching Staff' }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
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
