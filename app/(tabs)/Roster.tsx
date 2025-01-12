import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Papa from 'papaparse';
import styles from '../../constants/styles/roster';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
// @ts-ignore
import SwitchSelector from 'react-native-switch-selector';

type Player = {
  id: number;
  playerName: string;
  position: string;
  number: number;
  year: string;
  imageUrl: string;
  contentUrl: string;
};

type jsonPlayer = {
  id: number;
  playerName: string;
  position: string;
  number: number;
  year: string;
  imageUrl: string;
  contentUrl: string;
};

const RosterScreen = () => {
  const [roster, setRoster] = useState<{ [key: string]: Player[] }>({});
  const [flatRoster, setFlatRoster] = useState<Player[]>([]);
  const [isListView, setIsListView] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  const [sortColumn, setSortColumn] = useState<'number' | 'playerName' | 'position' | 'year'>('number');

  const fetchRoster = async () => {
    try {
      // Fetch JSON data
      const jsonResponse = await fetch('https://gt-lax-app.web.app/players.json');
      const jsonData = await jsonResponse.json();

      const jsonMap = new Map<string, jsonPlayer>(jsonData.map((player: jsonPlayer) => [player.playerName, player]));

      // Fetch CSV data
      const csvResponse = await fetch('https://gt-lax-app.web.app/players/theroster.csv');
      const csvText = await csvResponse.text();
      const parsedCSV = Papa.parse(csvText, { header: true }).data;

      const combinedRoster = parsedCSV.map((player: any) => {
        const jsonPlayer = jsonMap.get(player['Name']);
        return {
          id: Number(player['#']),
          playerName: player['Name'],
          position: player['Pos'],
          number: Number(player['#']),
          year: player['year']
          ? player['year'].charAt(0).toUpperCase() + player['year'].slice(1).toLowerCase() : '', // Capitalize first letter and lowercase the rest          
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
      let valueA = a[sortColumn];
      let valueB = b[sortColumn];
  
      // If sorting by "number", compare as numbers
      if (sortColumn === 'year') {
        // Define a custom order for the year field
        const yearOrder = ['Fr', 'So', 'Jr', 'Sr'];
        valueA = yearOrder.indexOf(a.year);
        valueB = yearOrder.indexOf(b.year);
      } else if (sortColumn === 'number') {
        valueA = Number(valueA);
        valueB = Number(valueB);
      } else {
        // Otherwise, compare as strings (case insensitive)
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
      }
  
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      }
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    });
  
    return sorted;
  };

  const toggleSortOrder = (column: 'number' | 'playerName' | 'position' | 'year') => {
    setSortColumn(column);
    setSortOrder((prev) =>
      prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default'
    );
  };

  const columnHeaders = {
    number: ' #',
    playerName: 'Name', // Change "PlayerName" to "Name"
    position: 'Position',
    year: 'Year',
  };  

  const getHeaderText = (column: 'number' |  'playerName' | 'position' | 'year') => {
    const displayName = columnHeaders[column];
    if (sortColumn === column) {
      if (sortOrder === 'asc') return `${displayName} ↑`;
      if (sortOrder === 'desc') return `${displayName} ↓`;
    }
    return displayName;
  };
  

  if (isListView) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Roster</Text>
        <SwitchSelector
          options={[
            { label: 'Grid', value: 0 },
            { label: 'List', value: 1 },
          ]}
          initial={isListView ? 1 : 0} // Sync with `isListView`
          onPress={(value: number) => {
            // Only toggle view if the selected value is different
            if (isListView !== (value === 1)) {
              setIsListView(value === 1);
            }
          }}
          buttonColor={Colors.techGold}
          backgroundColor={Colors.gray}
          textColor={Colors.white}
          selectedColor={Colors.black}
          style={{ width: 140, alignSelf: 'flex-end', marginBottom: 10 }}
          fontSize={14}
        />
        </View>
        <View style={styles.listViewHeader}>
          <TouchableOpacity onPress={() => toggleSortOrder('number')}>
            <Text style={styles.columnHeader}>{getHeaderText('number')}</Text>
          </TouchableOpacity>
          <Text></Text>
          <TouchableOpacity onPress={() => toggleSortOrder('playerName')}>
            <Text style={styles.columnHeader}>{getHeaderText('playerName')}</Text>
          </TouchableOpacity>
          <Text></Text>
          <TouchableOpacity onPress={() => toggleSortOrder('position')}>
            <Text style={styles.columnHeader}>{getHeaderText('position')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleSortOrder('year')}>
            <Text style={styles.columnHeader}>{getHeaderText('year')}</Text>
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
                  year: player.year,
                  imageUrl: player.imageUrl,
                  contentUrl: player.contentUrl,
                },
              }}
            >
              <View style={styles.listViewRow}>
                <Text style={[styles.listViewText, styles.listViewColumnNumber]}>{player.number}</Text>
                <Text style={[styles.listViewText, styles.listViewColumnName]}>{player.playerName}</Text>
                <Text style={[styles.listViewText, styles.listViewColumnPosition]}>{player.position}</Text>
                <Text style={[styles.listViewText, styles.listViewColumnYear]}>{player.year}</Text>
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
      <SwitchSelector
        options={[
          { label: 'Grid', value: 0 },
          { label: 'List', value: 1 },
        ]}
        initial={isListView ? 1 : 0} // Sync with `isListView`
        onPress={(value: number) => {
          // Only toggle view if the selected value is different
          if (isListView !== (value === 1)) {
            setIsListView(value === 1);
          }
        }}
        buttonColor={Colors.techGold}
        backgroundColor={Colors.gray}
        textColor={Colors.white}
        selectedColor={Colors.black}
        style={{ width: 140, alignSelf: 'flex-end', marginBottom: 10 }}
        fontSize={14}
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
                      year: player.year,
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
