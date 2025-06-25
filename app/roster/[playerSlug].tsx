import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import PlayerBio from './PlayerBio';
import { Image } from 'expo-image';
import Colors from '@/constants/Colors';
import { useAppData } from '@/context/AppDataProvider';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function PlayerSlugScreen() {
  const params = useLocalSearchParams();
  const playerSlug = params.playerSlug as string;
  const { roster } = useAppData();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('PlayerSlug received:', playerSlug);
    console.log('Current roster size:', roster.length);
    
    setLoading(true);
    
    // Handle different slug formats:
    // 1. Standard format: "john-doe" → "John Doe"
    // 2. Reversed from bio: "andrew-belli" → might need to check "Andrew Belli"
    
    const findPlayerBySlug = () => {
      // Convert slug to player name format (e.g., "john-doe" to "John Doe")
      const nameFromSlug = playerSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      console.log('Looking for player with name:', nameFromSlug);
      
      // Try multiple matching strategies
      let foundPlayer = null;
      
      // Strategy 1: Direct match on playerName
      foundPlayer = roster.find(p => 
        p.playerName.toLowerCase() === nameFromSlug.toLowerCase()
      );
      
      if (foundPlayer) {
        console.log('Found player by direct name match:', foundPlayer.playerName);
        return foundPlayer;
      }
      
      // Strategy 2: Match based on slug created from player name
      foundPlayer = roster.find(p => 
        p.playerName.toLowerCase().replace(/\s+/g, '-') === playerSlug.toLowerCase()
      );
      
      if (foundPlayer) {
        console.log('Found player by slug match:', foundPlayer.playerName);
        return foundPlayer;
      }
      
      // Strategy 3: Try reversed name order (for "lastname-firstname" format)
      // Split the slug, reverse it, and try again
      const slugParts = playerSlug.split('-');
      if (slugParts.length >= 2) {
        const reversedSlug = [...slugParts].reverse().join('-');
        const reversedNameFromSlug = reversedSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        console.log('Trying reversed name format:', reversedNameFromSlug);
        
        foundPlayer = roster.find(p => 
          p.playerName.toLowerCase() === reversedNameFromSlug.toLowerCase()
        );
        
        if (foundPlayer) {
          console.log('Found player by reversed name match:', foundPlayer.playerName);
          return foundPlayer;
        }
      }
      
      // Strategy 4: Look for partial matches (first/last name only)
      const partialMatches = roster.filter(p => {
        const playerNameParts = p.playerName.toLowerCase().split(' ');
        const slugParts = playerSlug.toLowerCase().split('-');
        
        // Check if any part of the player's name matches any part of the slug
        return playerNameParts.some(namePart => 
          slugParts.some(slugPart => slugPart === namePart.toLowerCase())
        );
      });
      
      if (partialMatches.length === 1) {
        console.log('Found player by partial name match:', partialMatches[0].playerName);
        return partialMatches[0];
      } else if (partialMatches.length > 1) {
        console.log('Multiple partial matches found, using first match:', partialMatches[0].playerName);
        return partialMatches[0];
      }
      
      console.log('No player match found for slug:', playerSlug);
      return null;
    };
    
    const matchedPlayer = findPlayerBySlug();
    setPlayer(matchedPlayer);
    setLoading(false);
    
  }, [playerSlug, roster]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading player...</Text>
      </View>
    );
  }
  
  if (!player) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Player not found</Text>
        <Text style={styles.actionText} onPress={() => router.back()}>
          Go back
        </Text>
      </View>
    );
  }
  
  return (
    // <AnimatedHeaderLayout headerText={player.playerName} recordText={`#${player.number}`} backgroundColor={styles.container.backgroundColor}>
    <ScrollView style={styles.container}>
        <PlayerBio selectedPlayer={player} />
    </ScrollView>
    // {/* </AnimatedHeaderLayout> */}
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  actionText: {
    fontSize: 16,
    color: Colors.techGold,
    textDecorationLine: 'underline',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  playerNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.techGold,
    marginBottom: 5,
  },
  playerPosition: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  playerYear: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  }
}); 