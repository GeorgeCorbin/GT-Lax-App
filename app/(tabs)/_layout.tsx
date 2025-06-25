import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet, StatusBar, View } from 'react-native';
import Colors from '@/constants/Colors';
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
  debug: Colors.background, // Add debug screen background
};

export default function TabLayout() {
  return (
    <>
      {/* Status Bar hidden */}
      {/* <StatusBar hidden /> */}
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Container with top padding for space buffer */}
      <View style={styles.container}>
        <Tabs
          screenOptions={({ route }: { route: RouteProp<Record<string, object | undefined>, string> }) => ({
            tabBarStyle: {
              backgroundColor: Colors.tabBackground,
              height: 100, // Increase the height of the tab bar
            },
            tabBarActiveTintColor: Colors.activeIcon, // Set the active tab label color to gold
            tabBarInactiveTintColor: Colors.inactiveIcon, // Set the inactive tab background color to navy
            tabBarLabelStyle: {
              fontSize: 16, // Increase the font size of the tab labels
            },
            headerStyle: { 
              backgroundColor: tabBackgroundColors[route.name],
              height: 60,
              shadowColor: 'transparent', // Remove the boarder line
            }, // Set the header background to navy
            headerTitle: '', // Removes the header title
            headerTintColor: Colors.buttonPrimary.text,
            // tabBarButton: route.name === 'Shop' ? () => null : undefined, // Hide the "Shop" tab
          })}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'News',
              tabBarIcon: ({ color }: { color: string } ) => <TabBarIcon name="newspaper-o" color={color} />,
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
          {/* <Tabs.Screen
            name="Shop"
            options={{
              title: 'Shop',
              tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="shopping-cart" color={color} />,
            }}
          /> */}
          <Tabs.Screen
            name="More"
            options={{
              title: 'More',
              tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="ellipsis-h" color={color} />,
            }}
          />
          
          {/* Debug screen - visible only in development mode */}
          {__DEV__ && (
            <Tabs.Screen
              name="debug"
              options={{
                title: 'Debug',
                tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="bug" color={color} />,
              }}
            />
          )}
        </Tabs>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
});