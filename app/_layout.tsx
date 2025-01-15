import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { AppDataProvider } from '@/context/AppDataProvider';

export {} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    SpaceMono: require('../assets/fonts/Roboto/Roboto-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppDataProvider>
      <RootLayoutNav />
    </AppDataProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <Stack>
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
          name="shop" 
          options={{ 
            title: '',
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