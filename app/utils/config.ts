/**
 * Configuration utilities for accessing environment variables
 * and other configuration settings
 */
import Constants from 'expo-constants';

// Get environment variables from expo-constants
// This will access variables from .env.local in development
// and from the appropriate environment in production
const getEnvVariable = (name: string): string => {
  const envVar = Constants.expoConfig?.extra?.[name];
  if (!envVar) {
    console.warn(`Environment variable ${name} not found`);
    return '';
  }
  return envVar as string;
};

// API key for notification endpoints
export const getNotificationApiKey = (): string => {
  return getEnvVariable('api_key');
};

export default {
  getNotificationApiKey,
};
