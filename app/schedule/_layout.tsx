import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { StyleSheet, StatusBar, View } from 'react-native';
import React from 'react';

export default function ScheduleLayout() {
  return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        {/* Container with top padding for space buffer */}
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: '' }} />
            <Stack.Screen name="GameCard" options={{ title: 'Game Info' }} />
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
