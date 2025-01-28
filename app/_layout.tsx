import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider, useNavigationState } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { AppDataProvider } from '@/context/AppDataProvider';

export {} from 'expo-router';

import UpdatePopup from '../components/UpdatePopup'; // Adjust path as needed

// export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  // initialRouteName: '(tabs)',
  // initialRouteName: 'NotificationInfoScreen',
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    SpaceMono: require('../assets/fonts/Roboto/Roboto-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [popupReady, setPopupReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const hasCompletedNotificationSetup = await AsyncStorage.getItem('hasCompletedNotificationSetup');
        const lastVersion = await AsyncStorage.getItem('lastVersion');
        const currentVersion = require('../package.json').version;

        // Check for app version updates
        if (lastVersion !== currentVersion) {
          await AsyncStorage.setItem('lastVersion', currentVersion);
          setShowUpdatePopup(true); // Flag the popup to show later
        }

        // Set initial route
        setInitialRoute(hasCompletedNotificationSetup ? '(tabs)' : 'RequestNotificationScreen');
      } catch (err) {
        console.error('Error during app initialization:', err);
        setInitialRoute('(tabs)'); // Default to main route on error
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (loaded && initialRoute) {
      // Wait for layout to render before hiding splash screen
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
        if (showUpdatePopup && initialRoute === '(tabs)') {
          // Delay popup to allow layout to render
          setTimeout(() => setPopupReady(true), 500);
        }
      }, 300); // Small delay to ensure smooth transition
      return () => clearTimeout(timer);
    }
  }, [loaded, initialRoute, showUpdatePopup]);

  if (!loaded || initialRoute === null) {
    return null; // Wait for fonts and initial route determination
  }

  return (
    <AppDataProvider>
      {/* Render UpdatePopup only when ready */}
      {popupReady && <UpdatePopup />}
      <RootLayoutNav initialRoute={initialRoute} />
    </AppDataProvider>
  );
}

function RootLayoutNav({ initialRoute }: { initialRoute: string }) {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={initialRoute}>
      {/* Initial Notification Flow Screens */}
        <Stack.Screen
          name="RequestNotificationScreen"
          options={{
            title: '',
            headerShown: false,
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.textSecondary,
          }}
        />

      {/* Main Tabs and Other Screens */}
      <Stack.Screen
          name="(tabs)" 
          options={{
            title: 'Back',
            headerShown: false,
            headerStyle: { backgroundColor: '#2f3553' },
            // headerTintColor: '#dac368',
            headerTintColor: Colors.textSecondary
          }}
        />
      <Stack.Screen 
          name="more" 
          options={{ 
            title: '',
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerShadowVisible: false,
            headerTintColor: Colors.textSecondary }} />
      <Stack.Screen 
          name="roster" 
          options={{ 
            title: '',
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerShadowVisible: false,
            headerTintColor: Colors.textSecondary }} />
      <Stack.Screen 
          name="schedule" 
          options={{ 
            title: 'Game Information',
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerShadowVisible: false,
            headerTintColor: Colors.textSecondary }} />
      <Stack.Screen 
          name="news" 
          options={{ 
            title: '',
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerShadowVisible: false,
            headerTintColor: Colors.textSecondary }} />
      
      {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
      {/* <Stack.Screen 
          name="screens" 
          options={{
            title: 'Back',
            headerShown: false,
            headerStyle: { backgroundColor: '#2f3553' },
            headerTintColor: '#dac368',
          }}
        /> */}
      </Stack>
    </ThemeProvider>
  );
}