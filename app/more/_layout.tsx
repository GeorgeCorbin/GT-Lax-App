import React from 'react';
import { Stack } from 'expo-router';

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="OldSeason" options={{ title: '' }} />
      <Stack.Screen name="StudentBoard" options={{ title: 'Student Board' }} />
      <Stack.Screen name="CoachingStaff" options={{ title: 'Coaching Staff' }} />
    </Stack>
  );
}
