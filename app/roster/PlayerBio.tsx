import React from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Colors from '@/constants/Colors';
import { useAppData } from '@/context/AppDataProvider';

type CareerStats = {
  headers: string[];
  rows: string[][];
} | null;

type Player = {
  id: number;
  playerName: string;
  position: string;
  number: number | null;
  imageUrl: string;
  height?: string | null;
  weight?: string | null;
  hometown?: string | null;
  state?: string | null;
  year?: string | null;
  highSchool?: string | null;
  achievements?: string[];
  careerStats?: CareerStats;
};

const PlayerBio = ({ selectedPlayer }: { selectedPlayer: Player | null }) => {
  const { imageConfig } = useAppData();
  
  if (!selectedPlayer) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Loading player data...</Text>
      </View>
    );
  }

  const isDefaultImage = selectedPlayer.imageUrl.includes('headshot_default.jpg');
  const contentPosition = imageConfig
    ? (isDefaultImage ? imageConfig.playerProfile.default : imageConfig.playerProfile.player)
    : (isDefaultImage ? { top: '50%', left: '50%' } : { top: '20%', left: '50%' });

  const getFullPosition = (pos: string) => {
    if (pos === 'D' || pos === 'LSM') return 'Defense';
    if (pos === 'A') return 'Attack';
    if (pos === 'M') return 'Midfield';
    if (pos === 'G' || pos === 'Goalies') return 'Goalie';
    if (pos === 'FO' || pos === 'Face-Off') return 'Face-Off';
    return pos;
  };

  const renderDetailItem = (label: string, value: string | null | undefined) => {
    if (!value) return null;
    return (
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    );
  };

  const renderStatsTable = () => {
    const stats = selectedPlayer.careerStats;
    if (!stats || !stats.headers || stats.headers.length === 0 || !stats.rows || stats.rows.length === 0) {
      return <Text style={styles.noDataText}>No career stats available.</Text>;
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScrollView}>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            {stats.headers.map((header, index) => (
              <View key={index} style={[styles.tableCell, styles.tableHeaderCell, index === 0 && styles.yearCell]}>
                <Text style={styles.tableHeaderText}>
                  {header === 'Year' ? header : header.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
          {stats.rows.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 && styles.tableRowEven]}>
              {row.map((cell, cellIndex) => (
                <View key={cellIndex} style={[styles.tableCell, cellIndex === 0 && styles.yearCell]}>
                  <Text style={[styles.tableCellText, cellIndex === 0 && styles.firstCellText]}>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: selectedPlayer.imageUrl }} 
          style={styles.playerImage}
          contentFit="cover"
          contentPosition={contentPosition}
        />
      </View>
      
      <Text style={styles.playerName}>{selectedPlayer.playerName}</Text>
      <Text style={styles.playerPosition}>{getFullPosition(selectedPlayer.position)}</Text>
      {selectedPlayer.number && <Text style={styles.playerNumber}>#{selectedPlayer.number}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player Details</Text>
        {renderDetailItem('Height', selectedPlayer.height)}
        {renderDetailItem('Weight', selectedPlayer.weight)}
        {renderDetailItem('Hometown', selectedPlayer.hometown)}
        {renderDetailItem('Position', getFullPosition(selectedPlayer.position))}
        {renderDetailItem('Year', selectedPlayer.year)}
        {renderDetailItem('State', selectedPlayer.state)}
        {renderDetailItem('High School', selectedPlayer.highSchool)}
      </View>

      {selectedPlayer.achievements && selectedPlayer.achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Honors and Achievements</Text>
          {selectedPlayer.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Career Stats</Text>
        {renderStatsTable()}
      </View>

      <View style={styles.bottomSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 16,
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  playerPosition: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  playerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.techGold,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.techGold,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.textSecondary,
    flex: 1,
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.techGold,
    marginRight: 8,
  },
  achievementText: {
    fontSize: 16,
    color: Colors.textSecondary,
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  tableScrollView: {
    marginTop: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.navyBlue,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: Colors.techGold,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  tableRowEven: {
    backgroundColor: '#f5f5f5',
  },
  tableCell: {
    minWidth: 45,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeaderCell: {
    minWidth: 45,
  },
  yearCell: {
    minWidth: 80,
    width: 80,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.background,
    textAlign: 'center',
  },
  tableCellText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  firstCellText: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default PlayerBio;
