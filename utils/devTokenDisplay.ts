import { getExpoToken } from './featureFlagService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_DISPLAY_KEY = '@token_displayed_session';

export const displayExpoTokenInTerminal = async (): Promise<void> => {
  if (!__DEV__) {
    return;
  }

  try {
    const sessionId = Date.now().toString();
    const lastDisplayedSession = await AsyncStorage.getItem(TOKEN_DISPLAY_KEY);
    
    const token = await getExpoToken();
    
    if (token) {
      if (lastDisplayedSession !== sessionId) {
        console.log('\n' + '='.repeat(70));
        console.log('🔑 EXPO PUSH TOKEN FOR FEATURE FLAG OVERRIDES:');
        console.log('');
        console.log(`   ${token}`);
        console.log('');
        console.log('💡 Add this token to feature_flags.json "allowed_tokens" array');
        console.log('   to enable feature flag overrides for this device.');
        console.log('='.repeat(70) + '\n');
        
        await AsyncStorage.setItem(TOKEN_DISPLAY_KEY, sessionId);
      }
    }
  } catch (error) {
    console.error('Error displaying expo token:', error);
  }
};

export const forceDisplayExpoToken = async (): Promise<void> => {
  if (!__DEV__) {
    return;
  }

  try {
    const token = await getExpoToken();
    
    if (token) {
      console.log('\n' + '='.repeat(70));
      console.log('🔑 EXPO PUSH TOKEN:');
      console.log('');
      console.log(`   ${token}`);
      console.log('');
      console.log('='.repeat(70) + '\n');
    }
  } catch (error) {
    console.error('Error displaying expo token:', error);
  }
};
