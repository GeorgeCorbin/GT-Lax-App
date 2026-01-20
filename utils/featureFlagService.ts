import axios from 'axios';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RemoteFeatureFlag {
  enabled: boolean;
  global_enabled: boolean;
  allowed_tokens: string[];
  description: string;
  last_updated: string;
  updated_by: string;
}

export interface RemoteFeatureFlags {
  [key: string]: RemoteFeatureFlag;
}

export interface EvaluatedFeatureFlag {
  enabled: boolean;
  description: string;
  last_updated: string;
}

export interface EvaluatedFeatureFlags {
  [key: string]: EvaluatedFeatureFlag;
}

const FEATURE_FLAGS_URL = 'https://gt-lax-app.web.app/feature_flags.json';
const EXPO_TOKEN_STORAGE_KEY = '@expo_push_token';
const FEATURE_FLAGS_CACHE_KEY = '@feature_flags_cache';
const CACHE_DURATION = 5 * 60 * 1000;

let cachedToken: string | null = null;
let cachedFlags: { flags: EvaluatedFeatureFlags; timestamp: number } | null = null;

export const getExpoToken = async (): Promise<string | null> => {
  if (cachedToken) {
    return cachedToken;
  }

  try {
    const storedToken = await AsyncStorage.getItem(EXPO_TOKEN_STORAGE_KEY);
    if (storedToken) {
      cachedToken = storedToken;
      return storedToken;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permissions not granted');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '5083a26f-f6f1-4fef-a42c-67b97e94727b',
    });
    
    const token = tokenData.data;
    await AsyncStorage.setItem(EXPO_TOKEN_STORAGE_KEY, token);
    cachedToken = token;

    if (__DEV__) {
      console.log('\n' + '='.repeat(60));
      console.log('🔑 EXPO PUSH TOKEN GENERATED:');
      console.log(token);
      console.log('='.repeat(60) + '\n');
    }

    return token;
  } catch (error) {
    console.error('Error getting Expo push token:', error);
    return null;
  }
};

export const fetchRemoteFeatureFlags = async (): Promise<RemoteFeatureFlags | null> => {
  try {
    const response = await axios.get(FEATURE_FLAGS_URL, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching remote feature flags:', error);
    return null;
  }
};

export const evaluateFeatureFlag = (
  flag: RemoteFeatureFlag,
  userToken: string | null
): boolean => {
  if (flag.global_enabled) {
    return true;
  }

  if (userToken && flag.allowed_tokens.includes(userToken)) {
    return flag.enabled;
  }

  return flag.enabled && flag.global_enabled;
};

export const getFeatureFlags = async (forceRefresh: boolean = false): Promise<EvaluatedFeatureFlags> => {
  if (!forceRefresh && cachedFlags) {
    const now = Date.now();
    if (now - cachedFlags.timestamp < CACHE_DURATION) {
      return cachedFlags.flags;
    }
  }

  try {
    const cachedData = await AsyncStorage.getItem(FEATURE_FLAGS_CACHE_KEY);
    if (!forceRefresh && cachedData) {
      const parsed = JSON.parse(cachedData);
      const now = Date.now();
      if (now - parsed.timestamp < CACHE_DURATION) {
        cachedFlags = parsed;
        return parsed.flags;
      }
    }
  } catch (error) {
    console.error('Error reading cached feature flags:', error);
  }

  const remoteFlags = await fetchRemoteFeatureFlags();
  const userToken = await getExpoToken();

  const defaultFlags: EvaluatedFeatureFlags = {
    game_information: { enabled: true, description: 'Master toggle for game information', last_updated: '2026-01-20' },
    game_info_field_name: { enabled: true, description: 'Show field name', last_updated: '2026-01-20' },
    game_info_image: { enabled: true, description: 'Show field image', last_updated: '2026-01-20' },
    game_info_location: { enabled: true, description: 'Show location', last_updated: '2026-01-20' },
    game_info_weather: { enabled: true, description: 'Show weather', last_updated: '2026-01-20' },
    game_info_streaming: { enabled: true, description: 'Show streaming info', last_updated: '2026-01-20' },
  };

  if (!remoteFlags) {
    console.log('Using default feature flags (remote fetch failed)');
    return defaultFlags;
  }

  const evaluatedFlags: EvaluatedFeatureFlags = {};

  for (const [key, flag] of Object.entries(remoteFlags)) {
    evaluatedFlags[key] = {
      enabled: evaluateFeatureFlag(flag, userToken),
      description: flag.description,
      last_updated: flag.last_updated,
    };
  }

  const cacheData = {
    flags: evaluatedFlags,
    timestamp: Date.now(),
  };

  cachedFlags = cacheData;

  try {
    await AsyncStorage.setItem(FEATURE_FLAGS_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching feature flags:', error);
  }

  return evaluatedFlags;
};

export const clearFeatureFlagsCache = async (): Promise<void> => {
  cachedFlags = null;
  try {
    await AsyncStorage.removeItem(FEATURE_FLAGS_CACHE_KEY);
  } catch (error) {
    console.error('Error clearing feature flags cache:', error);
  }
};
