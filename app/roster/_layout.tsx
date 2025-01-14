import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { StyleSheet, StatusBar, View } from 'react-native';
import React from 'react';

export default function RosterLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      {/* Container with top padding for space buffer */}
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            // animation: 'fade', // Set the global animation for all screens
          }}
        >
          {/* Default Screen */}
          <Stack.Screen
            name="index"
            options={{
              title: 'Roster',
              // animation: 'slide_from_bottom', // Override with specific animation
            }}
          />
          
          {/* PlayerBio Screen */}
          <Stack.Screen
            name="PlayerBio"
            options={{
              title: 'Player Bio',
              // animation: 'slide_from_bottom', // Slide from the bottom animation
            }}
          />
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
