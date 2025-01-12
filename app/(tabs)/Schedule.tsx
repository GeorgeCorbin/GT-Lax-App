import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import styles from '../../constants/styles/schedule'; // Updated path for styles
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import Colors from '@/constants/Colors';
import { SelectList } from 'react-native-dropdown-select-list';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAppData } from '@/context/AppDataProvider';

const seasons = [
  { key: '1', value: '2020-21' },
  { key: '2', value: '2021-22' },
  { key: '3', value: '2022-23' },
  { key: '4', value: '2023-24' },
  { key: '5', value: '2024-25' },
];

type Game = {
  title: string;
  link: string;
  description: string;
  category: string;
  pubDate: string;
  opponent: string | null;
  score: string | null;
};

const assetsLink = require.context('../../assets/images/Opponent_Logos', false, /\.(png|jpe?g|svg)$/);

// Function to dynamically load all logos
const loadTeamLogos = () => {
  const teamLogos: Record<string, any> = {};
  assetsLink.keys().forEach((fileName) => {
    const teamName = fileName
      .replace('./', '') // Remove './' from the beginning
      .replace(/\.\w+$/, '') // Remove the file extension
      .replace(/\s+/g, '') // Remove spaces
      .toLowerCase(); // Normalize to lowercase
    teamLogos[teamName] = assetsLink(fileName);
  });
  return teamLogos;
};

// Load the logos once and store them in a variable
const teamLogos = loadTeamLogos();

// Function to get the team logo path
const getTeamLogo = (teamName: string): any => {
  const formattedName = teamName.replace(/\s+/g, '').toLowerCase();
  return teamLogos[formattedName] || teamLogos.placeholder;
};


const Schedule = () => {
  const { schedule, loading, fetchScheduleForSeason } = useAppData();
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [season, setSelected] = useState('2024-25');
  const [completedGames, setCompletedGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);

  useEffect(() => {
    // Fetch new season each time user picks differently
    fetchScheduleForSeason(season);
  }, [season]);

  useEffect(() => {
    if (!loading && schedule.length > 0) {
      const completed = schedule.filter((game: Game) => game.score);
      const upcoming = schedule.filter((game: Game) => !game.score);

      // Calculate the record
      const record = completed.reduce(
        (acc: { wins: number; losses: number; }, game: Game) => {
          if (game.score && game.score.includes('W')) acc.wins++;
          else acc.losses++;
          return acc;
        },
        { wins: 0, losses: 0}
      );

      setCompletedGames(completed);
      setUpcomingGames(upcoming);
      setRecord(record);
    }
  }, [loading, schedule]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.activeIcon} />
      </View>
    );
  }

  return (
    <AnimatedHeaderLayout
      headerText="Schedule"
      recordText={`${record.wins}-${record.losses}`}
      backgroundColor={styles.container.backgroundColor}
    >
    {/* <ScrollView style={styles.container}> */}
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Schedule</Text>
        <Text style={styles.recordText}>
          {record.wins}-{record.losses}
        </Text>
      </View>

      {/* Upcoming Games Section */}
      {/* <Text style={styles.sectionTitle}>UPCOMING</Text> */}
      <View style={styles.dropRow}>
        <Text style={styles.sectionTitle}>UPCOMING</Text>
        <SelectList
        setSelected={setSelected}
        data={seasons}
        save="value"
        dropdownStyles={styles.dropdown}
        dropdownTextStyles={styles.dropdownText}
        boxStyles={styles.dropdownContainer}
        inputStyles={styles.dropdownItemText}
        searchPlaceholder=""
        placeholder="2024-25"
        search={false}
        fontFamily="Roboto-Regular-bold"
        arrowicon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 4 }}></Text>
            <AntDesign name="down" size={12} color={Colors.buttonPrimary.text} />
          </View>
        }
        />
      </View>
      {upcomingGames.map((game, index) => {
        // Determine if Georgia Tech is the home team
        const isHome = game.title.includes('vs. Georgia Tech');
        const cleanedTitle = game.title.replace(/Final/i, '').trim();
        const parts = cleanedTitle.split('vs.');
        const awayTeam = parts[0] ? parts[0].replace(/\d+/g, '').trim() : 'Away Team';
        const homeTeam = parts[1] ? parts[1].replace(/\d+/g, '').trim() : 'Home Team';


        return (
          <View key={index} style={styles.gameItem}>
            <View style={styles.row}>
              <View style={styles.teamColumn}>
                <View style={styles.team}>
                  <Image source={getTeamLogo(awayTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{awayTeam}</Text>
                </View>
                <View style={styles.team}>
                  <Image source={getTeamLogo(homeTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{homeTeam}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Game Details Section */}
              <View style={styles.detailsRow}>
                <Text style={styles.date}>
                  {new Date(game.pubDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={styles.time}>
                  {new Date(game.pubDate).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.location}>
                  {isHome ? 'Roe Stamps Field' : 
                        (game.description.includes('SELC') || game.description.includes('MCLA') ? game.description.split(',')[2] : 'Away')}
                </Text>
              </View>
            </View>
          </View>
        );
      })}


      {/* Completed Games Section */}
      <Text style={styles.sectionTitle}>COMPLETED</Text>
      {completedGames.map((game, index) => {
      // Determine if Georgia Tech is the home team
        const isHome = game.title.includes(', Georgia Tech');
        const opponent = game.opponent?.trim() || 'Unknown';
        const cleanedTitle = game.title.replace(/Final/i, '').trim();
        const [awayPart, homePart] = cleanedTitle.split(',');
        const awayTeam = awayPart ? awayPart.replace(/\d+/g, '').trim() : 'Away Team';
        const homeTeam = homePart ? homePart.replace(/\d+/g, '').trim() : 'Home Team';

        const extractScore = (part: string) => {
          const match = part.match(/(\d+)\s*(,|\s|$)/);
          return match ? match[1] : '0';
        };

        const awayScore = extractScore(awayPart);
        const homeScore = extractScore(homePart);

        return (
          <View key={index} style={styles.gameItem}>
            <View style={styles.row}>
              {/* Teams */}
              <View style={styles.teamColumn}>
                <View style={styles.team}>
                  <Image source={getTeamLogo(awayTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{awayTeam}</Text>
                  <Text style={styles.score}>{awayScore}</Text>
                </View>
                <View style={styles.team}>
                  <Image source={getTeamLogo(homeTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{homeTeam}</Text>
                  <Text style={styles.score}>{homeScore}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Game Details */}
              <View style={styles.detailsRow}>
                <Text style={[styles.result, game.score?.includes('W') ? styles.win : styles.loss]}>
                  {game.score?.includes('W') ? 'Win' : 'Loss'}
                </Text>
                <Text style={styles.date}>
                  {new Date(game.pubDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <Text style={styles.location}>
                  {isHome ? 'Roe Stamps Field' : 
                      (game.description.includes('SELC') || game.description.includes('MCLA') ? game.description.split(',')[2] : 'Away')}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </AnimatedHeaderLayout>
  );
};

export default Schedule;
