import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import Colors from '@/constants/Colors';

const rssURL23 = 'https://www.gtlacrosse.com/sports/mlax/2023-24/schedule?print=rss';
const rssURL25 = 'https://www.gtlacrosse.com/sports/mlax/2024-25/schedule?print=rss';

// Fetch the RSS feed and parse it
export const fetchSchedule = async () => {
  try {
    const response = await axios.get(rssURL25);

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


const Schedule = () => {
  const [completedGames, setCompletedGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const schedule = await fetchSchedule();

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
        <Text style={styles.headerText}>Schedule</Text>
        <Text style={styles.recordText}>
          {record.wins}-{record.losses}
        </Text>
      </View>

      {/* Upcoming Games Section */}
      <Text style={styles.sectionTitle}>UPCOMING</Text>
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
                  {isHome ? 'Roe Stamps Field' : 'Away'}
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
    backgroundColor: Colors.grayMatter, // Black background for the entire screen
    flex: 1,
    padding: 16,
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
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
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
  recordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.techGold, // Updated gold for the record text
  },

  // Section title (e.g., UPCOMING, COMPLETED)
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.techGold, // Updated gold
    marginVertical: 12,
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },

  // Game item card
  gameItem: {
    backgroundColor: Colors.navyBlue, // Updated navy background
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
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2.5,
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
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
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
    color: Colors.techGold, // Updated gold for loading text
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
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
   
});

export default Schedule;
