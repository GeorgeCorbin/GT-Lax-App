import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Papa from 'papaparse';
import styles from '../../constants/styles/roster'; // Ensure this path is correct
import Colors from '@/constants/Colors'; // Ensure this path is correct
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import { Link } from 'expo-router';

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

  // Fetch roster data from the CSV file
  const fetchRoster = async () => {
    try {
      // Fetch JSON data
      const jsonResponse = await fetch('https://gt-lax-app.web.app/players.json');
      const jsonData = await jsonResponse.json();
  
      // Create a map from the JSON data indexed by playerName
      type JsonPlayer = {
        id: number;
        playerName: string;
        position: string;
        imageUrl: string;
        contentUrl: string;
      };

      const jsonMap = new Map<string, JsonPlayer>(
        jsonData.map((player: JsonPlayer) => [player.playerName, player])
      );
  
      // Fetch CSV data
      const csvResponse = await fetch('https://gt-lax-app.web.app/players/roster2025.csv');
      const csvText = await csvResponse.text();
      const parsedCSV = Papa.parse(csvText, { header: true }).data;
  
      // Transform CSV data by merging URLs from JSON
      const combinedRoster = parsedCSV.map((player: any) => {
        const jsonPlayer = jsonMap.get(player['Name']);
        const result = {
          id: Number(player['#']),
          playerName: player['Name'],
          position: player['Pos'],
          number: Number(player['#']),
          imageUrl: jsonPlayer?.imageUrl || 'https://gt-lax-app.web.app/players/images/headshot_default.png',
          contentUrl: jsonPlayer?.contentUrl || 'https://gt-lax-app.web.app/players/bios/default_bio.md',
        };
        // console.log('Combined Player:', result);
        return result;
      });
  
      // console.log('Combined Roster:', combinedRoster);
  
      // Group players by position
      const groupedRoster = {
        Defense: combinedRoster.filter((player) => ['D', 'LSM'].includes(player.position)),
        Attack: combinedRoster.filter((player) => player.position === 'A'),
        Middies: combinedRoster.filter((player) => player.position === 'M'),
        Goalies: combinedRoster.filter((player) => player.position === 'G'),
        'Face-Off': combinedRoster.filter((player) => player.position === 'FO'),
      };
  
      // console.log('Grouped Roster:', groupedRoster);
  
      // Update state
      setRoster(groupedRoster);
    } catch (error) {
      console.error('Error fetching roster:', error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchRoster();
  }, []);

  if (loading) {
    return <Text style={{ color: Colors.techGold, textAlign: 'center' }}>Loading...</Text>;
  }

  // if (selectedPlayer) {
  //   return (
  //     <AnimatedHeaderLayout headerText={selectedPlayer.playerName} recordText={`#${selectedPlayer.number}`} backgroundColor={styles.container.backgroundColor}>
  //       <Image source={{ uri: selectedPlayer.imageUrl }} style={styles.detailImage} />
  //       <Text style={styles.detailName}>{selectedPlayer.playerName}</Text>
  //       <Text style={styles.detailPosition}>{selectedPlayer.position}</Text>
  //       <Text style={styles.detailNumber}>#{selectedPlayer.number}</Text>
  //       <TouchableOpacity style={styles.topBackButton} onPress={() => setSelectedPlayer(null)}>
  //         <Text style={styles.topBackButtonText}>← Back</Text>
  //       </TouchableOpacity>
  //       <Markdown
  //         style={{
  //           bold: {
  //             fontSize: 28,
  //             fontWeight: 'bold',
  //             color: Colors.techGold,
  //             marginBottom: 10,
  //           },
  //           body: {
  //             fontSize: 18,
  //             lineHeight: 24,
  //             color: Colors.diploma,
  //             padding: 12,
  //           },
  //           heading1: {
  //             fontSize: 28,
  //             fontWeight: 'bold',
  //             color: Colors.techGold,
  //             marginBottom: 10,
  //           },
  //           heading2: {
  //             fontSize: 24,
  //             fontWeight: 'bold',
  //             color: Colors.techGold,
  //             marginBottom: 8,
  //           },
  //           heading3: {
  //             fontSize: 20,
  //             fontWeight: 'bold',
  //             color: Colors.techDarkGold,
  //             marginBottom: 8,
  //           },
  //           paragraph: {
  //             marginBottom: 12,
  //           },
  //           link: {
  //             color: '#007bff',
  //             textDecorationLine: 'underline', // This will still work but without strict typing.
  //           },
  //           listItem: {
  //             fontSize: 16,
  //             marginBottom: 6,
  //           },
  //         }}
  //       >
  //         {markdownContent}
  //       </Markdown>
  //       <TouchableOpacity style={styles.bottombackButton} onPress={() => setSelectedPlayer(null)}>
  //         <Text style={styles.backButtonText}>Back to the Roster</Text>
  //       </TouchableOpacity>
  //     </AnimatedHeaderLayout>
  //   );
  // }

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
                // <TouchableOpacity
                //   style={styles.playerContainer}
                //   onPress={() => {
                //     setSelectedPlayer(player);
                //     fetchMarkdownContent(player.contentUrl);
                //   }}
                // >
                <Link
                  // style={styles.playerContainer}
                  href={{
                    pathname: '/roster/PlayerBio',
                    params: {
                      name: player.playerName,
                      number: player.number,
                      position: player.position,
                      imageUrl: player.imageUrl,
                      contentUrl: player.contentUrl,
                    },
                  }}
                  style={styles.playerContainerBox}
                >
                  <View style={styles.playerContainer}>
                    <Image source={{ uri: player.imageUrl }} style={styles.playerImage} />
                    <Text style={styles.playerName}>{player.playerName || 'Unknown'}</Text>
                    <Text style={styles.playerNumber}>
                      #{player.number?.toString() || 'N/A'}
                    </Text>
                  </View>
                </Link>
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
