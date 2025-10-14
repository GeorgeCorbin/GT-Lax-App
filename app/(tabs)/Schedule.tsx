import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { XMLParser } from 'fast-xml-parser';
import styles from '../../constants/styles/schedule'; // Updated path for styles
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import Colors from '@/constants/Colors';
import { SelectList } from 'react-native-dropdown-select-list';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAppData } from '@/context/AppDataProvider';
import { Link } from 'expo-router';
import { isHomeTeam, extractTeams, extractScores, loadTeamLogos, getTeamLogo, getRankingForTeamOnDate } from '../utils/gameUtils';

// Helper function to get the current season based on the current date
const getCurrentSeason = (): string => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-indexed, so add 1
  
  // Lacrosse season typically runs from January to May
  // If we're in August or later, we're in the next season
  // If we're before August, we're in the current season
  if (currentMonth >= 8) {
    // August or later: next season (e.g., Aug 2024 -> 2024-25)
    return `${currentYear}-${String(currentYear + 1).slice(-2)}`;
  } else {
    // Before August: current season (e.g., Jan 2025 -> 2024-25)
    return `${currentYear - 1}-${String(currentYear).slice(-2)}`;
  }
};

// Helper function to generate seasons from 2020-21 to current season
const generateSeasons = (): Array<{ key: string; value: string }> => {
  const currentSeason = getCurrentSeason();
  const currentSeasonYear = parseInt(currentSeason.split('-')[0]);
  const seasons = [];
  
  // Start from current season and go back to 2020 (reverse order)
  for (let year = currentSeasonYear; year >= 2020; year--) {
    const nextYear = String(year + 1).slice(-2);
    seasons.push({
      key: String(seasons.length + 1),
      value: `${year}-${nextYear}`
    });
  }
  
  return seasons;
};

// Generate seasons dynamically from 2020-21 to current season
const seasons = generateSeasons();

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

const location = (game: Game, isHome: boolean): string => {
  // Check for SELC Quarter Final games first
  if (game.description.includes('SELC Quarter')) {
    return isHome ? 'Roe Stamps Field\nSELC Quarter-Final' : 'Away\nSELC Quarter-Final';
  }
  
  // Check for other SELC playoff games or MCLA games
  if (game.description.includes('SELC') || game.description.includes('MCLA')) {
    return game.description.split(',')[2] || (isHome ? 'Roe Stamps Field' : 'Away');
  }
  
  // Regular season games
  return isHome ? 'Roe Stamps Field' : 'Away';
}

const Schedule = () => {
  const { schedule, loading, fetchScheduleForSeason, rankings, loadingRankings } = useAppData();
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [divisionRecord, setDivisionRecord] = useState({ wins: 0, losses: 0 });
  const [season, setSelected] = useState(getCurrentSeason());
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
      
      const divisionTeams = ['Georgia', 'Alabama', 'South Carolina', 'Vanderbilt'];

      const divisionRecord = completed.reduce(
        (acc: { wins: number; losses: number }, game: Game) => {
          const { awayTeam, homeTeam } = extractTeams(game.title);
          if (divisionTeams.includes(awayTeam) || divisionTeams.includes(homeTeam)) {
            if (game.score && game.score.includes('W')) acc.wins++;
            else acc.losses++;
          }
          return acc;
        },
        { wins: 0, losses: 0 }
      );

      setCompletedGames(completed);
      setUpcomingGames(upcoming);
      setRecord(record);
      setDivisionRecord(divisionRecord);
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
      recordText={`${record.wins}-${record.losses} (${divisionRecord.wins}-${divisionRecord.losses})`}
      backgroundColor={styles.container.backgroundColor}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Schedule</Text>
        <Text style={styles.recordText}>
          {record.wins}-{record.losses} ({divisionRecord.wins}-{divisionRecord.losses})
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

        // Display names should not show the conference tag
        const awayDisplayName = awayTeam.startsWith('TBD_') ? 'TBD' : awayTeam;
        const homeDisplayName = homeTeam.startsWith('TBD_') ? 'TBD' : homeTeam;

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
                  <Text style={styles.teamName}>{awayRank ? `#${awayRank} ` : ''}{awayDisplayName}</Text>
                </View>
                <View style={styles.team}>
                  <Image source={getTeamLogo(teamLogos, homeTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{homeRank ? `#${homeRank} ` : ''}{homeDisplayName}</Text>
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
                  {location(game, isHome)}
                </Text>
              </View>
            </View>
          </Link>
        );
      })}

      {/* COMPLETED */}
      <Text style={styles.sectionTitle}>COMPLETED</Text>
      {completedGames.slice().reverse().map((game, index) => {
        const { awayTeam, homeTeam } = extractTeams(game.title);
        const { awayScore, homeScore } = extractScores(game.title);
        const isHome = isHomeTeam(game.title);

        // Get rankings specific to this game
        const awayRank = getRankingForTeamOnDate(rankings, awayTeam, game.pubDate);
        const homeRank = getRankingForTeamOnDate(rankings, homeTeam, game.pubDate);

        // Display names should not show the conference tag
        const awayDisplayName = awayTeam.startsWith('TBD_') ? 'TBD' : awayTeam;
        const homeDisplayName = homeTeam.startsWith('TBD_') ? 'TBD' : homeTeam;

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
                  <Text style={styles.teamName}>{awayRank ? `#${awayRank} ` : ''}{awayDisplayName}</Text>
                  <Text style={styles.score}>{awayScore}</Text>
                </View>
                <View style={styles.team}>
                  <Image source={getTeamLogo(teamLogos, homeTeam)} style={styles.logo} />
                  <Text style={styles.teamName}>{homeRank ? `#${homeRank} ` : ''}{homeDisplayName}</Text>
                  <Text style={styles.score}>{homeScore}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsRow}>
                <Text style={[styles.result, game.score?.includes('W') ? styles.win : styles.loss]}>
                  {game.score?.includes('W') ? 'Win' : 'Loss'}{game.title?.includes('OT') ? ' - OT' : ''}
                </Text>
                <Text style={styles.date}>
                  {new Date(game.pubDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <Text style={styles.location}>
                  {location(game, isHome)}
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
