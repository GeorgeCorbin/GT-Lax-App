import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, Image } from 'react-native';
import Papa from 'papaparse';
import styles from '../../constants/styles/roster';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';

type Player = {
  id: number;
  playerName: string;
  position: string;
  number: number;
  imageUrl: string;
  contentUrl: string;
};

type jsonPlayer = {
  id: number;
  playerName: string;
  position: string;
  number: number;
  imageUrl: string;
  contentUrl: string;
};

const RosterScreen = () => {
  const [roster, setRoster] = useState<{ [key: string]: Player[] }>({});
  const [flatRoster, setFlatRoster] = useState<Player[]>([]);
  const [isListView, setIsListView] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  const [sortColumn, setSortColumn] = useState<'number' | 'playerName' | 'position'>('number');

  const fetchRoster = async () => {
    try {
      // Fetch JSON data
      const jsonResponse = await fetch('https://gt-lax-app.web.app/players.json');
      const jsonData = await jsonResponse.json();

      const jsonMap = new Map<string, jsonPlayer>(jsonData.map((player: jsonPlayer) => [player.playerName, player]));

      // Fetch CSV data
      const csvResponse = await fetch('https://gt-lax-app.web.app/players/roster2025.csv');
      const csvText = await csvResponse.text();
      const parsedCSV = Papa.parse(csvText, { header: true }).data;

      const combinedRoster = parsedCSV.map((player: any) => {
        const jsonPlayer = jsonMap.get(player['Name']);
        return {
          id: Number(player['#']),
          playerName: player['Name'],
          position: player['Pos'],
          number: Number(player['#']),
          imageUrl: jsonPlayer?.imageUrl || 'https://gt-lax-app.web.app/players/images/headshot_default.png',
          contentUrl: jsonPlayer?.contentUrl || 'https://gt-lax-app.web.app/players/bios/default_bio.md',
        };
      });

      // Group players by position
      const groupedRoster = {
        Defense: combinedRoster.filter((player) => ['D', 'LSM'].includes(player.position)),
        Attack: combinedRoster.filter((player) => player.position === 'A'),
        Middies: combinedRoster.filter((player) => player.position === 'M'),
        Goalies: combinedRoster.filter((player) => player.position === 'G'),
        'Face-Off': combinedRoster.filter((player) => player.position === 'FO'),
      };

      setRoster(groupedRoster); // Update grouped roster for default view
      setFlatRoster(combinedRoster);
    } catch (error) {
      console.error('Error fetching roster:', error);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const sortRoster = () => {
    const sorted = [...flatRoster];
    if (sortOrder === 'default') return flatRoster;

    sorted.sort((a, b) => {
      const valueA = a[sortColumn].toString();
      const valueB = b[sortColumn].toString();

      if (sortOrder === 'asc') {
        return valueA.localeCompare(valueB);
      }
      return valueB.localeCompare(valueA);
    });

    return sorted;
  };

  const toggleSortOrder = (column: 'number' | 'playerName' | 'position') => {
    setSortColumn(column);
    setSortOrder((prev) =>
      prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default'
    );
  };

  const getHeaderText = (column: 'number' | 'playerName' | 'position') => {
    if (sortColumn === column) {
      if (sortOrder === 'asc') return `${column.charAt(0).toUpperCase() + column.slice(1)} ↑`;
      if (sortOrder === 'desc') return `${column.charAt(0).toUpperCase() + column.slice(1)} ↓`;
    }
    return column.charAt(0).toUpperCase() + column.slice(1);
  };

  if (isListView) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Roster</Text>
          <Switch
            value={isListView}
            onValueChange={() => setIsListView((prev) => !prev)}
          />
        </View>
        <View style={styles.listViewHeader}>
          <TouchableOpacity onPress={() => toggleSortOrder('number')}>
            <Text style={styles.columnHeader}>{getHeaderText('number')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleSortOrder('playerName')}>
            <Text style={styles.columnHeader}>{getHeaderText('playerName')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleSortOrder('position')}>
            <Text style={styles.columnHeader}>{getHeaderText('position')}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={sortRoster()}
          keyExtractor={(player) => player.id.toString()}
          renderItem={({ item: player }) => (
            <Link
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
            >
              <View style={styles.listViewRow}>
                <Text style={styles.listViewText}>{player.number}</Text>
                <Text style={styles.listViewText}>{player.playerName}</Text>
                <Text style={styles.listViewText}>{player.position}</Text>
              </View>
            </Link>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Roster</Text>
        <Switch
          value={isListView}
          onValueChange={() => setIsListView((prev) => !prev)}
        />
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
                <Link
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
