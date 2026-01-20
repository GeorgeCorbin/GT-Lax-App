import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import styles from '../../constants/styles/roster';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
// @ts-ignore
import SwitchSelector from 'react-native-switch-selector';
import { useAppData } from '@/context/AppDataProvider';

type CareerStats = {
  headers: string[];
  rows: string[][];
} | null;

type Player = {
  id: number;
  playerName: string;
  position: string;
  number: number;
  year: string;
  imageUrl: string;
  height: string | null;
  weight: string | null;
  hometown: string | null;
  state: string | null;
  highSchool: string | null;
  achievements: string[];
  careerStats: CareerStats;
};

const RosterScreen = () => {
  const { roster, loading, imageConfig } = useAppData();
  const [isListView, setIsListView] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  const [sortColumn, setSortColumn] = useState<'number' | 'playerName' | 'position' | 'year'>('number');
  const [groupedRoster, setGroupedRoster] = useState<Record<string, Player[]>>({});

  useEffect(() => {
    if (roster.length > 0) {
      const groupedRoster = {
        Defense: roster.filter((p) => ['D', 'LSM'].includes(p.position)),
        Attack: roster.filter((p) => p.position === 'A'),
        Middies: roster.filter((p) => p.position === 'M'),
        Goalies: roster.filter((p) => p.position === 'G'),
        'Face-Off': roster.filter((p) => p.position === 'FO'),
      };

      const imagePromises = roster.map((player) => Image.prefetch(player.imageUrl));
      Promise.all(imagePromises).then(() => setGroupedRoster(groupedRoster));
    }
  }, [roster, loading]);

  const sortRoster = () => {
    const sorted = [...roster];
    if (sortOrder === 'default') return roster;
  
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.loadingWheel} />
      </View>
    );
  }

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
          bold={true}
          backgroundColor={Colors.gray}
          textColor={Colors.white}
          selectedColor={Colors.grayMatter}
          style={{ width: 140, alignSelf: 'flex-end', marginBottom: 10, fontFamily: 'roboto-regular-bold', fontWeight: 'bold' }}
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
          renderItem={({ item: player }) => {
            const playerSlug = player.playerName.toLowerCase().replace(/\s+/g, '-');
            return (
            <Link
              href={`/roster/${playerSlug}`}
            >
              <View style={styles.listViewRow}>
                <Text style={[styles.listViewText, styles.listViewColumnNumber]}>{player.number}</Text>
                <Text style={[styles.listViewText, styles.listViewColumnName]}>{player.playerName}</Text>
                <Text style={[styles.listViewText, styles.listViewColumnPosition]}>{player.position}</Text>
                <Text style={[styles.listViewText, styles.listViewColumnYear]}>{player.year}</Text>
              </View>
            </Link>
            );
          }}
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
        bold={true}
        backgroundColor={Colors.gray}
        textColor={Colors.white}
        selectedColor={Colors.grayMatter}
        style={{ width: 140, alignSelf: 'flex-end', marginBottom: 10 }}
        fontSize={14}
      />

      </View>
      <FlatList
        data={Object.entries(groupedRoster) as [string, Player[]][]} // Object entries for grouped data
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
              renderItem={({ item: player }) => {
                const playerSlug = player.playerName.toLowerCase().replace(/\s+/g, '-');
                const isDefaultImage = player.imageUrl.includes('headshot_default.jpg');
                const transform = imageConfig
                  ? (isDefaultImage ? imageConfig.rosterGrid.default : imageConfig.rosterGrid.player)
                  : (isDefaultImage 
                      ? { scale: 1.3, translateX: 0, translateY: 5 }
                      : { scale: 1.3, translateX: 0, translateY: 5 });
                
                return (
                <Link
                  href={`/roster/${playerSlug}`}
                  style={styles.playerContainerBox}
                >
                  <View style={styles.playerContainer}>
                    <View style={{ overflow: 'hidden', borderRadius: 50, marginBottom: 5, width: 100, height: 100 }}>
                      <Image 
                        source={{ uri: player.imageUrl }} 
                        style={[
                          styles.playerImage,
                          {
                            transform: [
                              { scale: transform.scale },
                              { translateX: transform.translateX },
                              { translateY: transform.translateY }
                            ]
                          }
                        ]} 
                      />
                    </View>
                    {/* <Image source={{ uri: player.imageUrl }} style={styles.playerImage} /> */}
                    <Text style={styles.playerName}>{player.playerName || 'Unknown'}</Text>
                    <Text style={styles.playerNumber}>
                      #{player.number?.toString() || 'N/A'}
                    </Text>
                  </View>
                </Link>
                );
              }}
              horizontal
            />
          </View>
        )}
      />
    </View>
  );
};

export default RosterScreen;
