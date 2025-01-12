import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { StyleSheet, StatusBar, View } from 'react-native';
import React from 'react';

export default function ShopLayout() {
  return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        {/* Container with top padding for space buffer */}
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Shop' }} />
            <Stack.Screen name="ItemListing" options={{ title: 'Item Listing' }} />
            <Stack.Screen name="Checkout" options={{ title: 'Checkout' }} />
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
