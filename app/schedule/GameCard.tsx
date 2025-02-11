import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { isHomeTeam, extractTeams, getTeamLogo, getFieldImage, loadFieldImages, getRankingForTeamOnDate, getUniversityDetails } from '../utils/gameUtils';
import { useSearchParams } from 'expo-router/build/hooks';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppData } from '@/context/AppDataProvider';

const NWS_API_URL = 'https://api.weather.gov';

type GameInfo = {
  id: string;
  location: string;
  fieldImage: string;
  fieldName: string;
  latitude: number;
  longitude: number;
  conference: string;
  region: string;
  coverageText: string;
  coverageLink: string;
};

const GameCard = () => {
  const params = useSearchParams(); // Use useSearchParams to access route params
  const [gameInfo, setGameInfo] = useState<GameInfo[]>([]);
  const [loadingGameInfo, setLoadingGameInfo] = useState(true);

  useEffect(() => {
    const fetchGameInfo = async () => {
      try {
        // Fetch game info from the server
        const response = await fetch(`https://gt-lax-app.web.app/game_info.json`);
        const gameInfo = await response.json();
        setGameInfo(gameInfo);
        setLoadingGameInfo(false);
      } catch (error) {
        console.error('Error fetching game info:', error);
      }
    };
    fetchGameInfo();
  }, []);

  if (!params || !params.get('game') || !params.get('teamLogos')) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: No game or logo data available</Text>
      </View>
    );
  }
  const game = JSON.parse(params.get('game')!); // Parse the game data
  const teamLogos = JSON.parse(params.get('teamLogos')!); // Parse the team logos data
  
  const { title, pubDate, description } = game;

  // Use gameUtils to extract teams and determine if it's a home game
  const { awayTeam, homeTeam } = extractTeams(title);
  const isHome = isHomeTeam(title);

  const normalizeTeamName = (team: string) => team.toLowerCase().replace(/\s+/g, '');

  const homeTeamId = normalizeTeamName(homeTeam);
  const awayTeamId = normalizeTeamName(awayTeam);
  
  const homeGameInfo = gameInfo?.find(info => normalizeTeamName(info.id) === homeTeamId);
  const awayGameInfo = gameInfo?.find(info => normalizeTeamName(info.id) === awayTeamId);
  
  const homeTeamConference = homeGameInfo?.conference;
  const homeTeamRegion = homeGameInfo?.region;
  const awayTeamConference = awayGameInfo?.conference;
  const awayTeamRegion = awayGameInfo?.region;
  const fieldImage = (game.description.includes('SELC') && !game.description.includes('Quarter')) ? gameInfo.find(info => info.id === 'SELC')?.fieldImage : (game.description.includes('MCLA') ? gameInfo.find(info => info.id === 'MCLA')?.fieldImage : homeGameInfo?.fieldImage);
  const field = (game.description.includes('SELC') && !game.description.includes('Quarter')) ? gameInfo.find(info => info.id === 'SELC')?.fieldName : (game.description.includes('MCLA') ? gameInfo.find(info => info.id === 'MCLA')?.fieldName : homeGameInfo?.fieldName);
  const gameLocation = (game.description.includes('SELC') && !game.description.includes('Quarter')) ? gameInfo.find(info => info.id === 'SELC')?.location : (game.description.includes('MCLA') ? gameInfo.find(info => info.id === 'MCLA')?.location : homeGameInfo?.location);
  const latitude = (game.description.includes('SELC') && !game.description.includes('Quarter')) ? gameInfo.find(info => info.id === 'SELC')?.latitude : (game.description.includes('MCLA') ? gameInfo.find(info => info.id === 'MCLA')?.latitude : homeGameInfo?.latitude);
  const longitude = (game.description.includes('SELC') && !game.description.includes('Quarter')) ? gameInfo.find(info => info.id === 'SELC')?.longitude : (game.description.includes('MCLA') ? gameInfo.find(info => info.id === 'MCLA')?.longitude : homeGameInfo?.longitude);


  const { rankings, loadingRankings } = useAppData();
  const [awayRanking, setAwayRanking] = useState<number | null>(null);
  const [homeRanking, setHomeRanking] = useState<number | null>(null);

  interface WeatherPeriod {
    temperature: number;
    temperatureUnit: string;
    shortForecast: string;
    windSpeed: string;
    startTime: string;
    endTime: string;
  }
  
  type WeatherData = WeatherPeriod | string | null; // Can be a period, error string, or null

  // Map NWS shortForecast to icons
  const getWeatherIcon = (shortForecast: string): string => {
    if (/sunny|clear/i.test(shortForecast)) return 'weather-sunny';
    if (/cloudy|overcast/i.test(shortForecast)) return 'weather-cloudy';
    if (/rain|showers/i.test(shortForecast)) return 'weather-rainy';
    if (/storm|thunder/i.test(shortForecast)) return 'weather-lightning-rainy';
    if (/snow|sleet/i.test(shortForecast)) return 'weather-snowy';
    if (/fog|mist/i.test(shortForecast)) return 'weather-fog';
    return 'weather-partly-cloudy'; // Default icon
  };

  const [weather, setWeather] = useState<WeatherData>(null);
  const [weatherOneWeek, setWeatherOneWeek] = useState<WeatherData>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch NWS metadata
        let lat = latitude;
        let long = longitude;

        const pointsResponse = await fetch(`${NWS_API_URL}/points/${lat},${long}`);
        if (!pointsResponse.ok) throw new Error('Failed to fetch NWS metadata.');
        const pointsData = await pointsResponse.json();
  
        // Fetch the hourly forecast first
        let forecastUrl = pointsData.properties.forecastHourly;
        let forecastResponse = await fetch(forecastUrl);
        let forecastData = await forecastResponse.json();
  
        // Find the hourly forecast period matching the game time
        const gameDateTime = new Date(pubDate).toISOString();
        let matchingPeriod = forecastData.properties.periods.find(
          (period: { startTime: string | number | Date; endTime: string | number | Date; }) =>
            new Date(period.startTime).toISOString() <= gameDateTime &&
            new Date(period.endTime).toISOString() >= gameDateTime
        );
  
        // If no hourly forecast is found, fallback to the daily forecast
        if (!matchingPeriod) {
          forecastUrl = pointsData.properties.forecast;
          forecastResponse = await fetch(forecastUrl);
          forecastData = await forecastResponse.json();
  
          // Match daily forecast
          matchingPeriod = forecastData.properties.periods.find((period: { startTime: string | number | Date; }) => {
            const periodDate = new Date(period.startTime).toDateString();
            const gameDate = new Date(pubDate).toDateString();
            return periodDate === gameDate;
          });
        }

        if (!matchingPeriod) {
          // Fetch the weather for one week from today
          const oneWeekFromToday = new Date();
          oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 6);
          const oneWeekDateString = oneWeekFromToday.toISOString();

          const oneWeekPeriod = forecastData.properties.periods.find((period: { startTime: string | number | Date; }) => {
            const periodDate = new Date(period.startTime).toDateString();
            const oneWeekDate = new Date(oneWeekDateString).toDateString();
            return periodDate === oneWeekDate;
          });

          setWeatherOneWeek(oneWeekPeriod || null);
          setWeather(null);
        } else {
          setWeather(matchingPeriod);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching weather:', error.message);
        } else {
          console.error('Error fetching weather:', error);
        }
        setWeather(null);
      }
    };

    if (!loadingGameInfo && latitude && longitude) {
      fetchWeather();
    }    
    if (!loadingRankings) {
      const awayRank = getRankingForTeamOnDate(rankings, awayTeam, pubDate);
      const homeRank = getRankingForTeamOnDate(rankings, homeTeam, pubDate);
      setAwayRanking(awayRank);
      setHomeRanking(homeRank);
    }
  }, [rankings, latitude, longitude, awayTeam, homeTeam, pubDate, loadingGameInfo]);

  return (
    <ScrollView style={styles.container}>      
      {/* Image of the field */}
      {(fieldImage && fieldImage !== "") ? (
        <Image source={{ uri: fieldImage }} style={styles.detailImage} />
      ) : (
        <View style={styles.noImageBox}>
          <Text style={styles.noImageText}>Image of This Field is Unavailable</Text>
        </View>
      )}

      {/* Stadium Name*/}
      <Text style={styles.detailPosition}>
        Field: {field}
      </Text>

      {/* Team Logos Section */}
      <View style={styles.teamRow}>
        <View style={styles.team}>
          <Image source={getTeamLogo(teamLogos, awayTeam)} style={styles.logo} />
          <Text style={styles.teamName}>{awayRanking ? `#${awayRanking} ` : ''}{awayTeam}</Text>
            <Text style={styles.conferenceName}>
            {awayTeamConference}
            {awayTeamRegion && `, ${awayTeamRegion}`}
            </Text>
        </View>
        <Text style={styles.vsText}>{game.description.includes('SELC') || game.description.includes('MCLA') ? 'vs.' : '@'}</Text>
        <View style={styles.team}>
          <Image source={getTeamLogo(teamLogos, homeTeam)} style={styles.logo} />
          <Text style={styles.teamName}>{homeRanking ? `#${homeRanking} ` : ''}{homeTeam}</Text>
          <Text style={styles.conferenceName}>
            {homeTeamConference}
            {homeTeamRegion && `, ${homeTeamRegion}`}
          </Text>        
        </View>
      </View>

      {/* Game Details Section */}
      <View style={styles.details}>
        {/* Date */}
        <Text style={styles.date}>
          {new Date(pubDate).toLocaleString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })} on {new Date(pubDate).toLocaleString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
        </Text>

        {/* Coverage */}
        {(new Date(pubDate) > new Date() /* replace with your current season logic */ && homeGameInfo?.coverageText !== "") && (
          <Text style={styles.detailText}>
            Coverage:{' '}
            {homeGameInfo?.coverageLink.trim() !== "" ? (
              <Text
                style={{ color: Colors.textSecondary, textDecorationLine: 'underline' }}
                onPress={() => Linking.openURL(homeGameInfo?.coverageLink!)}
              >
                {homeGameInfo?.coverageText}
              </Text>
            ) : (
              homeGameInfo.coverageText
            )}
          </Text>
        )}
      </View>

      {/* Weather Information */}
      <View style={styles.weatherBox}>
        {/*  location */}
        <Text style={styles.location}>{gameLocation}</Text>

        {/* Weather */}
        {weather ? (
          typeof weather === 'string' ? (
            <Text style={styles.noWeatherText}>{weather}</Text>
          ) : (
            <View style={{ flex: 2 }}>
              <View style={styles.weatherDetails}>
                <Text style={styles.weatherTitleText}>Gametime Weather:</Text>
                <Text style={styles.weatherText}>
                  {weather.temperature}°{weather.temperatureUnit}{ '  ' }
                  <MaterialCommunityIcons
                    name={getWeatherIcon(weather.shortForecast)}
                    size={24}
                    color={Colors.textPrimary}
                  />
                </Text>
                {/* <Text style={styles.weatherText}>{weather.shortForecast}</Text> */}
                {weather.windSpeed && 
                <Text style={styles.weatherText}>
                  {weather.windSpeed}{ '  ' }
                  <MaterialCommunityIcons
                    name={'weather-windy'}
                    size={24}
                    color={Colors.textPrimary}
                  />
                </Text>}
              </View>

            </View>
          )
        ) : (
          // <Text style={styles.noWeatherText}>
          //   <MaterialCommunityIcons
          //     name={'weather-sunny-off'}
          //     size={24}
          //     color={Colors.grayMatter}
          //   />
          //   {' '} Weather Data {'\n'} Not Available Yet {'\n'} Check Back Later
          // </Text>
          ''
        )}
      </View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.errorText,
    fontSize: 16,
    fontFamily: 'roboto-regular',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
    fontFamily: 'roboto-regular-bold',
  },
  date: {
    fontSize: 20,
    color: Colors.textSecondary,
    marginVertical: 4,
    fontFamily: 'roboto-regular',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 24,
  },
  team: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Allow equal space for each team
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: 'roboto-regular-bold',
  },
  conferenceName: {
    fontSize: 16,
    color: Colors.grayMatter,
    fontFamily: 'roboto-regular',
  },
  vsText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.grayMatter,
    fontFamily: 'roboto-regular-bold',
    marginHorizontal: 8, // Add some spacing around the "vs"
  },
  details: {
    borderTopColor: Colors.grayMatter,
    borderTopWidth: 0.5,
    padding: 16,
    // backgroundColor: Colors.diploma,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  detailText: {
    fontSize: 20,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontFamily: 'roboto-regular',
  },
  location: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
    alignSelf: 'flex-start',
    flex: 1,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: Colors.grayMatter,
  },
  noImageBox: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    backgroundColor: Colors.diploma,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: Colors.grayMatter,
  },
  noImageText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'roboto-regular',
  },
  detailPosition: {
    fontSize: 15,
    color: Colors.grayMatter,
    marginBottom: 25,
    marginLeft: 16,
    textAlign: 'left',
    fontFamily: 'roboto-regular',
  },
  weatherBox: {
    borderTopColor: Colors.grayMatter,
    borderTopWidth: 0.5,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 10,
    marginBottom: 16,
  },
  weatherText: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
    textAlign: 'right',
  },
  weatherTitleText: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
    marginBottom: 8,
    textAlign: 'right',
  },
  noWeatherText: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
    textAlign: 'right',
    flex: 1,
  },
  weatherDetails: {
    marginLeft: 16,
  },
});

export default GameCard;
