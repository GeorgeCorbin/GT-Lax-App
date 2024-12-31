import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import styles from '../../constants/styles/schedule'; // Updated path for styles
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import vector icon library
import Colors from '@/constants/Colors';

const rssURL23 = 'https://www.gtlacrosse.com/sports/mlax/2023-24/schedule?print=rss';
const rssURL25 = 'https://www.gtlacrosse.com/sports/mlax/2024-25/schedule?print=rss';

const seasons = [
  { label: '2020-21', value: '2020-21' },
  { label: '2021-22', value: '2021-22' },
  { label: '2022-23', value: '2022-23' },
  { label: '2023-24', value: '2023-24' },
  { label: 'Current Season', value: '2024-25' },
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
  const [season, setSeason] = useState('2024-25'); // Default season
  const [loading, setLoading] = useState(true);

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
        <Text style={styles.loadingText}>Loading schedule...</Text>
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
        <ModalDropdown
          options={seasons.map((s) => s.label)} // Map labels for the dropdown
          defaultValue="Current Season"
          onSelect={(index: any) => {
            const selectedSeason = seasons[index].value;
            setSeason(selectedSeason); // Update the season state
          }}
          dropdownStyle={styles.dropdownContainer} // Style the dropdown
          textStyle={styles.dropdownText} // Style the button text
          dropdownTextStyle={styles.dropdownItemText} // Style the dropdown items
          dropdownTextHighlightStyle={styles.dropdownItemTextHighlight} // Highlight selected item
          style={styles.dropdown} // Style the dropdown button
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
