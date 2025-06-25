import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import axios from 'axios';

interface FeatureFlags {
  automatic_article_notifications: {
    enabled: boolean;
    global_enabled: boolean;
    allowed_tokens: string[];
    description: string;
    last_updated: string;
    updated_by: string;
  };
}

const FeatureFlagManager = () => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newToken, setNewToken] = useState('');

  const fetchFeatureFlags = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://gt-lax-app.web.app/feature_flags.json');
      setFeatureFlags(response.data);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      Alert.alert('Error', 'Failed to fetch feature flags');
    } finally {
      setLoading(false);
    }
  };

  const saveFeatureFlags = async (updatedFlags: FeatureFlags) => {
    try {
      setSaving(true);
      
      // Add timestamp and admin info
      const flagsToSave = {
        ...updatedFlags,
        automatic_article_notifications: {
          ...updatedFlags.automatic_article_notifications,
          last_updated: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          updated_by: 'admin'
        }
      };

      // Note: In a real app, you'd need to implement a secure API endpoint
      // to update the feature flags. For now, show what would be saved.
      console.log('Feature flags to save:', JSON.stringify(flagsToSave, null, 2));
      
      Alert.alert(
        'Save Feature Flags',
        'Feature flags would be saved to Firebase hosting. In this demo, the changes are logged to console.\n\nTo implement saving, you would need to:\n1. Create a secure admin API endpoint\n2. Authenticate the user\n3. Update the feature_flags.json file\n4. Redeploy hosting',
        [
          { text: 'OK', onPress: () => setFeatureFlags(flagsToSave) }
        ]
      );
    } catch (error) {
      console.error('Error saving feature flags:', error);
      Alert.alert('Error', 'Failed to save feature flags');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatureEnabled = () => {
    if (!featureFlags) return;
    
    const updated = {
      ...featureFlags,
      automatic_article_notifications: {
        ...featureFlags.automatic_article_notifications,
        enabled: !featureFlags.automatic_article_notifications.enabled
      }
    };
    saveFeatureFlags(updated);
  };

  const toggleGlobalEnabled = () => {
    if (!featureFlags) return;
    
    const updated = {
      ...featureFlags,
      automatic_article_notifications: {
        ...featureFlags.automatic_article_notifications,
        global_enabled: !featureFlags.automatic_article_notifications.global_enabled
      }
    };
    saveFeatureFlags(updated);
  };

  const addToken = () => {
    if (!featureFlags || !newToken.trim()) return;
    
    const trimmedToken = newToken.trim();
    if (featureFlags.automatic_article_notifications.allowed_tokens.includes(trimmedToken)) {
      Alert.alert('Error', 'Token already exists in the list');
      return;
    }
    
    const updated = {
      ...featureFlags,
      automatic_article_notifications: {
        ...featureFlags.automatic_article_notifications,
        allowed_tokens: [...featureFlags.automatic_article_notifications.allowed_tokens, trimmedToken]
      }
    };
    saveFeatureFlags(updated);
    setNewToken('');
  };

  const removeToken = (tokenToRemove: string) => {
    if (!featureFlags) return;
    
    Alert.alert(
      'Remove Token',
      `Are you sure you want to remove this token?\n\n${tokenToRemove}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updated = {
              ...featureFlags,
              automatic_article_notifications: {
                ...featureFlags.automatic_article_notifications,
                allowed_tokens: featureFlags.automatic_article_notifications.allowed_tokens.filter(
                  token => token !== tokenToRemove
                )
              }
            };
            saveFeatureFlags(updated);
          }
        }
      ]
    );
  };

  const testNotification = async () => {
    try {
      const response = await axios.post(
        "https://us-central1-gt-lax-app.cloudfunctions.net/sendArticleNotification",
        { 
          newArticlesCount: 1,
          articleTitles: ["Test Article: Feature Flag System Working!"]
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Test notification sent:", response.data);
      Alert.alert("Success", "Test notification sent! Check your device for the notification.");
    } catch (error) {
      console.error("Error sending test notification:", error);
      Alert.alert("Error", "Failed to send test notification");
    }
  };

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.techGold} />
        <Text style={styles.loadingText}>Loading feature flags...</Text>
      </View>
    );
  }

  if (!featureFlags) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load feature flags</Text>
        <TouchableOpacity style={styles.button} onPress={fetchFeatureFlags}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const notificationFeature = featureFlags.automatic_article_notifications;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Feature Flag Manager</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Automatic Article Notifications</Text>
        <Text style={styles.description}>{notificationFeature.description}</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Feature Enabled</Text>
          <Switch
            value={notificationFeature.enabled}
            onValueChange={toggleFeatureEnabled}
            trackColor={{ false: Colors.grayMatter, true: Colors.techGold }}
            thumbColor={notificationFeature.enabled ? Colors.diploma : Colors.textSecondary}
          />
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Global Rollout</Text>
          <Switch
            value={notificationFeature.global_enabled}
            onValueChange={toggleGlobalEnabled}
            trackColor={{ false: Colors.grayMatter, true: Colors.techGold }}
            thumbColor={notificationFeature.global_enabled ? Colors.diploma : Colors.textSecondary}
            disabled={!notificationFeature.enabled}
          />
        </View>
        
        <Text style={styles.statusText}>
          Status: {notificationFeature.enabled ? 
            (notificationFeature.global_enabled ? 
              'Active for all users' : 
              `Testing with ${notificationFeature.allowed_tokens.length} allowed token(s)`
            ) : 
            'Disabled'
          }
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allowed Tokens (Testing Mode)</Text>
        <Text style={styles.description}>
          When global rollout is disabled, notifications will only be sent to these tokens:
        </Text>
        
        {notificationFeature.allowed_tokens.map((token, index) => (
          <View key={index} style={styles.tokenRow}>
            <Text style={styles.tokenText} numberOfLines={1}>
              {token}
            </Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeToken(token)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={styles.addTokenContainer}>
          <TextInput
            style={styles.tokenInput}
            placeholder="Enter push token..."
            value={newToken}
            onChangeText={setNewToken}
            placeholderTextColor={Colors.textSecondary}
          />
          <TouchableOpacity 
            style={[styles.addButton, !newToken.trim() && styles.disabledButton]}
            onPress={addToken}
            disabled={!newToken.trim()}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Testing</Text>
        <TouchableOpacity style={styles.testButton} onPress={testNotification}>
          <Text style={styles.testButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.metaTitle}>Metadata</Text>
        <Text style={styles.metaText}>Last Updated: {notificationFeature.last_updated}</Text>
        <Text style={styles.metaText}>Updated By: {notificationFeature.updated_by}</Text>
      </View>

      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color={Colors.techGold} />
          <Text style={styles.savingText}>Saving...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.techGold,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    color: Colors.techGold,
    fontWeight: 'bold',
    marginTop: 10,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  tokenText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  removeButton: {
    backgroundColor: '#FF4444',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addTokenContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tokenInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  addButton: {
    backgroundColor: Colors.techGold,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.grayMatter,
  },
  addButtonText: {
    color: Colors.diploma,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: Colors.techMediumGold,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  testButtonText: {
    color: Colors.diploma,
    fontWeight: 'bold',
    fontSize: 16,
  },
  metaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  button: {
    backgroundColor: Colors.techGold,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.diploma,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
});

export default FeatureFlagManager; 