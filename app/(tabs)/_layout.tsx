import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet, StatusBar, View } from 'react-native';
import Constants from 'expo-constants';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      {/* Status Bar hidden */}
      <StatusBar hidden />

      {/* Container with top padding for space buffer */}
      <View style={styles.container}>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: Colors.navyTint, // Set the tab bar background to light navy
            },
            tabBarActiveTintColor: '#dac368', // Set the active tab label color to gold
            headerShown: false,  // Hide the header
            // headerStyle: {
            //   backgroundColor: Colors.navyTint, // Set the header background to dark navy
            // },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'News',
              tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
            }}
          />
          <Tabs.Screen
            name="Schedule"
            options={{
              title: 'Schedule',
              tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
            }}
          />
          <Tabs.Screen
            name="Roster"
            options={{
              title: 'Roster',
              tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
            }}
          />
          <Tabs.Screen
            name="Shop"
            options={{
              title: 'Shop',
              tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
            }}
          />
          <Tabs.Screen
            name="More"
            options={{
              title: 'More',
              tabBarIcon: ({ color }) => <TabBarIcon name="ellipsis-h" color={color} />,
            }}
          />
        </Tabs>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navyTint, // Match the tab bar background color
    paddingTop: Constants.statusBarHeight, // Add padding equivalent to the status bar height
  },
});