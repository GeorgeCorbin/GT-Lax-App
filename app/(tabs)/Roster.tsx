import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Papa from 'papaparse';
import styles from '../../constants/styles/roster'; // Ensure this path is correct
import Colors from '@/constants/Colors'; // Ensure this path is correct
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';

type Player = {
  id: number;
  playerName: string;
  position: string;
  number: number;
  imageUrl: string;
  contentUrl: string;
};

const RosterScreen = () => {
  const [roster, setRoster] = useState<{ [key: string]: Player[] }>({
    Defense: [],
    Attack: [],
    Middies: [],
    Goalies: [],
    'Face-Off': [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');

  // Fetch roster data from the CSV file
  const fetchRoster = async () => {
    try {
      const csvResponse = await fetch('https://gt-lax-app.web.app/players/roster2025.csv');
      const csvText = await csvResponse.text();

      const parsedCSV = Papa.parse(csvText, { header: true }).data;

      // Map and transform data to match the expected format
      const transformedRoster = parsedCSV.map((player: any) => ({
        id: player['#'], // Map `#` to `id`
        playerName: player['Name'], // Map `Name` to `playerName`
        position: player['Pos'], // Map `Pos` to `position`
        number: player['#'], // Use `#` as a placeholder for `number`
        imageUrl: 'https://gt-lax-app.web.app/players/images/headshot_default.png', // Placeholder image URL
        contentUrl: 'https://gt-lax-app.web.app/players/bios/default_bio.md', // Placeholder content URL
      }));

      // Group players by position
      const groupedRoster = {
        Defense: transformedRoster.filter((player) => ['D', 'LSM'].includes(player.position)),
        Attack: transformedRoster.filter((player) => player.position === 'A'),
        Middies: transformedRoster.filter((player) => player.position === 'M'),
        Goalies: transformedRoster.filter((player) => player.position === 'G'),
        'Face-Off': transformedRoster.filter((player) => player.position === 'FO'),
      };

      setRoster(groupedRoster);
    } catch (error) {
      console.error('Error fetching roster:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch markdown content for the selected player
  const fetchMarkdownContent = async (url: string) => {
    try {
      const response = await fetch(url);
      const content = await response.text();
      setMarkdownContent(content);
    } catch (error) {
      console.error('Error fetching markdown content:', error);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <TouchableOpacity
      style={styles.playerContainer}
      onPress={() => {
        setSelectedPlayer(item);
        fetchMarkdownContent(item.contentUrl);
      }}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.playerImage} />
      <Text style={styles.playerName}>{item.playerName}</Text>
      <Text style={styles.playerNumber}>#{item.number}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Text style={{ color: Colors.techGold, textAlign: 'center' }}>Loading...</Text>;
  }

  if (selectedPlayer) {
    return (
      <AnimatedHeaderLayout headerText="Roster" backgroundColor={styles.container.backgroundColor}>
        <Image source={{ uri: selectedPlayer.imageUrl }} style={styles.detailImage} />
        <Text style={styles.detailName}>{selectedPlayer.playerName}</Text>
        <Text style={styles.detailPosition}>{selectedPlayer.position}</Text>
        <Text style={styles.detailNumber}>#{selectedPlayer.number}</Text>
        <Markdown
          style={{
            bold: {
              fontSize: 28,
              fontWeight: 'bold',
              color: Colors.techGold,
              marginBottom: 10,
            },
            body: {
              fontSize: 18,
              lineHeight: 24,
              color: Colors.diploma,
              padding: 12,
            },
            heading1: {
              fontSize: 28,
              fontWeight: 'bold',
              color: Colors.techGold,
              marginBottom: 10,
            },
            heading2: {
              fontSize: 24,
              fontWeight: 'bold',
              color: Colors.techGold,
              marginBottom: 8,
            },
            heading3: {
              fontSize: 20,
              fontWeight: 'bold',
              color: Colors.techDarkGold,
              marginBottom: 8,
            },
            paragraph: {
              marginBottom: 12,
            },
            link: {
              color: '#007bff',
              textDecorationLine: 'underline', // This will still work but without strict typing.
            },
            listItem: {
              fontSize: 16,
              marginBottom: 6,
            },
          }}
        >
          {markdownContent}
        </Markdown>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedPlayer(null)}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </AnimatedHeaderLayout>
    );
  }

  return (
    <View style={styles.container}>
      {/* Large Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Roster</Text>
      </View>

      <FlatList
        data={Object.entries(roster)} // Object entries for grouped data
        keyExtractor={(item) => item[0]?.toString() || ''} // Use the group name as the key
        renderItem={({ item }) => (
          <View style={styles.section}>
            {/* Check if item[0] is valid */}
            <Text style={styles.sectionHeader}>
              {item[0] || 'Unknown Group'}
            </Text>

            <FlatList
              data={item[1]} // Players in the group
              keyExtractor={(player) =>
                player.id?.toString() || `player-${Math.random()}`
              } // Ensure unique keys for players
              renderItem={({ item: player }) => (
                <TouchableOpacity
                  style={styles.playerContainer}
                  onPress={() => {
                    setSelectedPlayer(player);
                    fetchMarkdownContent(player.contentUrl);
                  }}
                >
                  <Image source={{ uri: player.imageUrl }} style={styles.playerImage} />
                  <Text style={styles.playerName}>{player.playerName || 'Unknown'}</Text>
                  <Text style={styles.playerNumber}>
                    #{player.number?.toString() || 'N/A'}
                  </Text>
                </TouchableOpacity>
              )}
              horizontal
            />
          </View>
        )}
      />

    </View>
  );
};

export default RosterScreen;
