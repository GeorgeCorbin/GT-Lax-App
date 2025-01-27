import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { XMLParser } from 'fast-xml-parser';
import styles from '../../constants/styles/schedule'; // Updated path for styles
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import Colors from '@/constants/Colors';
import { SelectList } from 'react-native-dropdown-select-list';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAppData } from '@/context/AppDataProvider';
import { Link } from 'expo-router';
import { isHomeTeam, extractTeams, extractScores, loadTeamLogos, getTeamLogo, getRankingForTeamOnDate } from '../utils/gameUtils';

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

// Preload the team logos
const assetsLink = require.context('../../assets/images/Opponent_Logos', false, /\.(png|jpe?g|svg)$/);
const teamLogos = loadTeamLogos(assetsLink);

const Schedule = () => {
  const { schedule, loading, fetchScheduleForSeason, rankings, loadingRankings } = useAppData();
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [season, setSelected] = useState('2024-25');
  const [completedGames, setCompletedGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [awayRanking, setAwayRanking] = useState<number | null>(null);
  const [homeRanking, setHomeRanking] = useState<number | null>(null);

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
        (acc: { wins: number; losses: number }, game: Game) => {
          if (game.score && game.score.includes('W')) acc.wins++;
          else acc.losses++;
          return acc;
        },
        { wins: 0, losses: 0 }
      );

      setCompletedGames(completed);
      setUpcomingGames(upcoming);
      setRecord(record);
    }
  }, [loading, schedule]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.loadingWheel} />
      </View>
    );
  }

  return (
    <AnimatedHeaderLayout
      headerText="Schedule"
      recordText={`${record.wins}-${record.losses}`}
      backgroundColor={styles.container.backgroundColor}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Schedule</Text>
        <Text style={styles.recordText}>
          {record.wins}-{record.losses}
        </Text>
      </View>

      {/* UPCOMING */}
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
          placeholder={season}
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
        const { awayTeam, homeTeam } = extractTeams(game.title);
        const isHome = isHomeTeam(game.title);

        // Get rankings specific to this game
        const awayRank = getRankingForTeamOnDate(rankings, awayTeam, game.pubDate);
        const homeRank = getRankingForTeamOnDate(rankings, homeTeam, game.pubDate);

        return (
          <Link
            key={index}
            href={{
              pathname: '/schedule/GameCard',
              params: { game: JSON.stringify(game), teamLogos: JSON.stringify(teamLogos) },
            }}
            style={styles.gameItem}
          >
            <View style={styles.row}>
              <View style={styles.teamColumn}>
                <View style={styles.team}>
                  <Image source={getTeamLogo(teamLogos, awayTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{awayRank ? `#${awayRank} ` : ''}{awayTeam}</Text>
                </View>
                <View style={styles.team}>
                  <Image source={getTeamLogo(teamLogos, homeTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{homeRank ? `#${homeRank} ` : ''}{homeTeam}</Text>
                </View>
              </View>

              <View style={styles.divider} />

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
                  {isHome
                    ? 'Roe Stamps Field'
                    : game.description.includes('SELC') || game.description.includes('MCLA')
                    ? game.description.split(',')[2]
                    : 'Away'}
                </Text>
              </View>
            </View>
          </Link>
        );
      })}

      {/* COMPLETED */}
      <Text style={styles.sectionTitle}>COMPLETED</Text>
      {completedGames.map((game, index) => {
        const { awayTeam, homeTeam } = extractTeams(game.title);
        const { awayScore, homeScore } = extractScores(game.title);
        const isHome = isHomeTeam(game.title);

        return (
          // <View key={index} style={styles.gameItem}>
          <Link
            key={index}
            href={{
              pathname: '/schedule/GameCard',
              params: { game: JSON.stringify(game), teamLogos: JSON.stringify(teamLogos) },
            }}
            style={styles.gameItem}
          >
            <View style={styles.row}>
              <View style={styles.teamColumn}>
                <View style={styles.team}>
                  <Image source={getTeamLogo(teamLogos, awayTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{awayRanking ? `#${awayRanking} ` : ''}{awayTeam}</Text>
                  <Text style={styles.score}>{awayScore}</Text>
                </View>
                <View style={styles.team}>
                  <Image source={getTeamLogo(teamLogos, homeTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{homeRanking ? `#${homeRanking} ` : ''}{homeTeam}</Text>
                  <Text style={styles.score}>{homeScore}</Text>
                </View>
              </View>

              <View style={styles.divider} />

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
                  {isHome
                    ? 'Roe Stamps Field'
                    : game.description.includes('SELC') || game.description.includes('MCLA')
                    ? game.description.split(',')[2]
                    : 'Away'}
                </Text>
              </View>
            </View>
          </Link>
        );
      })}
    </AnimatedHeaderLayout>
  );
};

export default Schedule;
