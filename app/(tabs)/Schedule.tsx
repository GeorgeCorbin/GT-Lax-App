import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import styles from '../../constants/styles/schedule'; // Updated path for styles
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import Colors from '@/constants/Colors';
import { SelectList } from 'react-native-dropdown-select-list';
import AntDesign from 'react-native-vector-icons/AntDesign';

const seasons = [
  { key: '1', value: '2020-21' },
  { key: '2', value: '2021-22' },
  { key: '3', value: '2022-23' },
  { key: '4', value: '2023-24' },
  { key: '5', value: '2024-25' },
];

// Fetch the RSS feed and parse it
const fetchSchedule = async (season: string | undefined) => {
  const rssURL =`https://www.gtlacrosse.com/sports/mlax/${season}/schedule?print=rss`;
  try {
    const response = await axios.get(rssURL);
    const parser = new XMLParser({ ignoreAttributes: false });
    const feed = parser.parse(response.data);
    const items = feed.rss.channel.item;

    return items.map((item: any) => ({
      title: item.title,
      link: item.link,
      description: item.description,
      category: item.category,
      pubDate: item.pubDate,
      opponent: item["ps:opponent"] || null,
      score: item["ps:score"] || null,
    }));
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
};

type Game = {
  title: string;
  link: string;
  description: string;
  category: string;
  pubDate: string;
  opponent: string | null;
  score: string | null;
};

const assetsLink = require.context('../../assets/images/Division1_Team_Logos', false, /\.(png|jpe?g|svg)$/);

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
  const [completedGames, setCompletedGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  // const [season, setSeason] = useState('2024-25'); // Default season
  const [loading, setLoading] = useState(true);
  const [season, setSelected] = useState('2024-25');

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const schedule = await fetchSchedule(season);

        const completed = schedule.filter((game: Game) => game.score);
        const upcoming = schedule.filter((game: Game) => !game.score);

        // Calculate the record
        const record = completed.reduce(
          (acc: { wins: number; losses: number; }, game: { score: string | string[]; }) => {
            if (game.score?.includes('W')) acc.wins++;
            else acc.losses++;
            return acc;
          },
          { wins: 0, losses: 0}
        );

        setCompletedGames(completed);
        setUpcomingGames(upcoming);
        setRecord(record);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [season]);

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
