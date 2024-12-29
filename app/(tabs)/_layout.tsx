import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, StatusBar, View } from 'react-native';
import Constants from 'expo-constants';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { RouteProp } from '@react-navigation/native';
import NewsStyles from '../../constants/styles/news'; // Updated path for styles
import ScheduleStyles from '../../constants/styles/schedule'; // Updated path for styles
import RosterStyles from '../../constants/styles/roster'; // Updated path for styles
import ShopStyles from '../../constants/styles/shop'; // Updated path for styles
import MoreStyles from '../../constants/styles/more'; // Updated path for styles

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const tabBackgroundColors: { [key: string]: string } = {
  index: NewsStyles.container.backgroundColor,
  Schedule: ScheduleStyles.container.backgroundColor, // Match the container background color
  Roster: RosterStyles.container.backgroundColor, // Gray for Roster
  Shop: ShopStyles.container.backgroundColor,
  More: MoreStyles.container.backgroundColor,
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      {/* Status Bar hidden */}
      {/* <StatusBar hidden /> */}

      {/* Container with top padding for space buffer */}
      <View style={styles.container}>
        <Tabs
          screenOptions={({ route }: { route: RouteProp<Record<string, object | undefined>, string> }) => ({
            tabBarStyle: {
              backgroundColor: Colors.navyTint, // Set the tab bar background to light navy
            },
            tabBarActiveTintColor: Colors.techGold, // Set the active tab label color to gold
            // headerShown: false,  // Hide the header
            headerStyle: { 
              backgroundColor: tabBackgroundColors[route.name],
              height: 60,
              shadowColor: 'transparent', // Remove the boarder line
            }, // Set the header background to navy
            headerTitle: '', // Removes the header title
          })}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'News',
              tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="newspaper-o" color={color} />,
            }}
          />
          <Tabs.Screen
            name="Schedule"
            options={{
              title: 'Schedule',
              tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="calendar" color={color} />,
            }}
          />
          <Tabs.Screen
            name="Roster"
            options={{
              title: 'Roster',
              tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="users" color={color} />,
            }}
          />
          <Tabs.Screen
            name="Shop"
            options={{
              title: 'Shop',
              tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="shopping-cart" color={color} />,
            }}
          />
          <Tabs.Screen
            name="More"
            options={{
              title: 'More',
              tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="ellipsis-h" color={color} />,
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
    // backgroundColor: tabBackgroundColors[Route.name], // Match the tab bar background color
    // paddingTop: Constants.statusBarHeight, // Add padding equivalent to the status bar height
  },
});