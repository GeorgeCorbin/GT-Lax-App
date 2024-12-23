import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import styles from '../../constants/styles/roster'; // Updated path for styles
import { NavigationProp } from '@react-navigation/native';
import defaultHeadshot from '@assets/images/rosterPictures/headshot_default.png'; // Updated path for default headshot

type Player = {
  name: string;
  number: string;
  position: 'Defense' | 'Middies' | 'Attack' | 'Goalies' | 'Coaches';
  image?: string;
};

const RosterScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [roster, setRoster] = useState<{ [key in Player['position']]: Player[] }>({ Defense: [], Middies: [], Attack: [], Goalies: [], Coaches: [] });

  useEffect(() => {
    const fetchRoster = async () => {
      const csvUri = FileSystem.documentDirectory + 'assets/roster2025.csv'; // Adjust path if needed
      const csvContent = await FileSystem.readAsStringAsync(csvUri);
      const parsed = Papa.parse<Player>(csvContent, { header: true }).data as Player[];

      type Player = {
        name: string;
        number: string;
        position: 'Defense' | 'Middies' | 'Attack' | 'Goalies' | 'Coaches';
        image?: string;
      };

      const grouped: { [key in Player['position']]: Player[] } = { Defense: [], Middies: [], Attack: [], Goalies: [], Coaches: [] };
      parsed.forEach((player: Player) => {
        grouped[player.position].push(player);
      });
      setRoster(grouped);
    };

    fetchRoster();
  }, []);

  const defaultHeadshot = require('/Users/georgecorbin/GT-Lax-App/assets/images/rosterPictures/headshot_default.png'); // Updated path for default headshot
  const renderPlayer = (player: { name: string; number: string; position: string; image?: string }) => (
    <TouchableOpacity
      style={styles.playerContainer}
      onPress={() => navigation.navigate('Bio', { player })}
    >
      <Image
        source={defaultHeadshot} // Replace with player.image if available
        style={styles.playerImage}
      />
      <Text style={styles.playerName}>{player.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={Object.entries(roster)}
      keyExtractor={(item) => item[0]}
      renderItem={({ item }) => (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>{item[0]}</Text>
          <FlatList
            data={item[1]}
            keyExtractor={(player) => player.number}
            renderItem={({ item: player }) => renderPlayer(player)}
            horizontal
          />
        </View>
      )}
    />
  );
};

export default RosterScreen;
