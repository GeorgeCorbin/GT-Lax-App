import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { RouteProp } from '@react-navigation/native';
import { useRouter, SearchParams } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

// Fetch the RSS feed and parse it
export const fetchSchedule = async (year: String) => {
  try {
    const response = await axios.get(`https://www.gtlacrosse.com/sports/mlax/${year}/schedule?print=rss`);

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

const assetsLink = "../../assets/images/teamLogos/"

const teamLogos: Record<string, any> = {
    alabama: require(`${assetsLink}Alabama.png`),
    arizonastate: require(`${assetsLink}ArizonaState.png`),
    auburn: require(`${assetsLink}Auburn.png`),
    bostoncollege: require(`${assetsLink}BostonCollege.png`),
    california: require(`${assetsLink}California.png`),
    centralflorida: require(`${assetsLink}CentralFlorida.png`),
    clemson: require(`${assetsLink}Clemson.png`),
    colorado: require(`${assetsLink}Colorado.png`),
    connecticut: require(`${assetsLink}Connecticut.png`),
    florida: require(`${assetsLink}Florida.png`),
    floridastate: require(`${assetsLink}FloridaState.png`),
    georgia: require(`${assetsLink}Georgia.png`),
    georgiatech: require(`${assetsLink}GeorgiaTech.png`),
    liberty: require(`${assetsLink}Liberty.png`),
    newhampshire: require(`${assetsLink}NewHampshire.png`),
    northcarolinastate: require(`${assetsLink}NorthCarolinaState.png`),
    northeastern: require(`${assetsLink}Northeastern.png`),
    placeholder: require(`${assetsLink}placeholder.png`),
    southcarolina: require(`${assetsLink}SouthCarolina.png`),
    tbd: require(`${assetsLink}TBA.png`),
    tennessee: require(`${assetsLink}Tennessee.png`),
    texasam: require(`${assetsLink}TexasA&M.png`),
    texas: require(`${assetsLink}Texas.png`),
    utahvalley: require(`${assetsLink}UtahValley.png`),
    vanderbilt: require(`${assetsLink}Vanderbilt.png`),
    virginiatech: require(`${assetsLink}VirginiaTech.png`),
    westvirginia: require(`${assetsLink}WestVirginia.png`),
};

// Function to get the team logo path
const getTeamLogo = (teamName: string): any => {
  const formattedName = teamName.replace(/\s/g, '').toLowerCase();
  return teamLogos[formattedName] || teamLogos.placeholder;
};

// type ScheduleRouteProp = RouteProp<{ params: { year: string } }, 'params'>;

const oldSeason = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const year = searchParams.get('year') || '';
  const [completedGames, setCompletedGames] = useState<Game[]>([]);
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const schedule = await fetchSchedule(year);
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
        setRecord(record);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading schedule...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{year} Season</Text>
        <Text style={styles.recordText}>
          {record.wins}-{record.losses}
        </Text>
        {/* Back Button */}
        {/* <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
        </TouchableOpacity> */}
      </View>

      

      {/* Completed Games Section */}
      <Text style={styles.sectionTitle}>COMPLETED</Text>
      {completedGames.map((game, index) => {
      // Determine if Georgia Tech is the home team
        const isHome = game.title.includes('vs. Georgia Tech');
        const opponent = game.opponent?.trim() || 'Unknown';
        const cleanedTitle = game.title.replace(/Final/i, '').trim();
        const [awayPart, homePart] = cleanedTitle.split(',');
        const awayTeam = awayPart ? awayPart.replace(/\d+/g, '').trim() : 'Away Team';
        const homeTeam = homePart ? homePart.replace(/\d+/g, '').trim() : 'Home Team';

        const [awayScore, homeScore] = game.score ? game.score.split('-').map((s) => s.replace(/[^\d]/g, '').trim()) : ['0', '0'];

        return (
          <View key={index} style={styles.gameItem}>
            <View style={styles.row}>
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
                  {isHome ? 'Roe Stamps Field' : 'Away'}
                </Text>
              </View>
            </View>
          </View>
        );
      })}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // General container for the screen
  container: {
    backgroundColor: '#000', // Black background for the entire screen
    flex: 1,
    padding: 16,
  },

  // Header section
  header: {
    flexDirection: 'row', // Align header items side by side
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF', // White text for the header
  },
  recordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DAC368', // Updated gold for the record text
  },

  // Section title (e.g., UPCOMING, COMPLETED)
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DAC368', // Updated gold
    marginVertical: 12,
  },

  // Game item card
  gameItem: {
    backgroundColor: '#22284A', // Updated navy background
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },

  // Teams layout within a game card
  teamRow: {
    flexDirection: 'column', // Stack teams vertically
    marginBottom: 8,
  },
  teamColumn: {
    flexDirection: 'column', // Stack teams vertically
    flex: 2, // Allow room for the team section
  },
  team: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space team name and score evenly
    marginBottom: 8,
  },  
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White for team names
    flex: 2, // Take available space but leave room for the score
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },

  // Date and time section
  detailsRow: {
    flexDirection: 'column',
    alignItems: 'flex-end', // Align items to the right
    justifyContent: 'center', // Center-align within the available space
    paddingLeft: 8, // Prevent the details from being too close to the edge
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF', // White text for dates
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF', // White text for times
    marginTop: 4,
  },
  location: {
    fontSize: 12, // Smaller font for location details
    color: '#FFFFFF', // White text for location
    marginTop: 4,
  },

  // Loading screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Black background
  },
  loadingText: {
    fontSize: 18,
    color: '#DAC368', // Updated gold for loading text
  },

  // Team Info (repeated in both teams)
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Row for organizing items horizontally
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Date and time alignment section
  dateTime: {
    flex: 1,
    alignItems: 'flex-end', // Align to the right
  },

  // Result, win, loss, and score styles
  result: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  win: {
    color: 'green', // Green for wins
  },
  loss: {
    color: 'red', // Red for losses
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White for scores
    marginLeft: 16, // Add spacing between the team name and score
  },
  backButton: {
    padding: 10,
    backgroundColor: '#DAC368', // Updated gold for the back button
    borderRadius: 5,
  },
  backText: {
    color: '#000', // Black text for the back button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default oldSeason;
