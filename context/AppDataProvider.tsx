import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { XMLParser } from 'fast-xml-parser';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export interface ShopItem {
  id: string;
  title: string;
  Price: number;
  imageUrl: string;
  contentUrl: string;
  colors: string[];
  sizes: string[];
}

type Game = {
  title: string;
  link: string;
  description: string;
  category: string;
  pubDate: string;
  opponent: string | null;
  score: string | null;
};

type Player = {
  id: number;
  playerName: string;
  position: string;
  number: number;
  year: string;
  imageUrl: string;
  contentUrl: string;
};

type Article = {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  imageAuthor: string;
  contentUrl: string;
};

type AppDataContextType = {
  shopItems: ShopItem[];
  schedule: Game[];
  roster: Player[];
  articles: Article[];
  loading: boolean;
  fetchScheduleForSeason: (season: string) => Promise<void>;
};

const AppDataContext = createContext<AppDataContextType>({
  shopItems: [],
  schedule: [],
  roster: [],
  articles: [],
  loading: true,
  fetchScheduleForSeason: async () => {},
});

const getLocalImageUri = async (url: string) => {
  const filename = url.split('/').pop();
  const localUri = `${FileSystem.documentDirectory}${filename}`;
  const fileInfo = await FileSystem.getInfoAsync(localUri);

  if (!fileInfo.exists) {
    await FileSystem.downloadAsync(url, localUri);
  }

  return localUri;
};

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [schedule, setSchedule] = useState<Game[]>([]);
  const [roster, setRoster] = useState<Player[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScheduleForSeason = async (season: string) => {
    setLoading(true);
    try {
      const rssURL = `https://www.gtlacrosse.com/sports/mlax/${season}/schedule?print=rss`;
      const scheduleResponse = await axios.get(rssURL);
      const parser = new XMLParser({ ignoreAttributes: false });
      const feed = parser.parse(scheduleResponse.data);
      const items = feed.rss.channel.item;
      const allGames = items.map((item: any) => ({
        title: item.title,
        link: item.link,
        description: item.description,
        category: item.category,
        pubDate: item.pubDate,
        opponent: item["ps:opponent"] || null,
        score: item["ps:score"] || null,
      }));
      setSchedule(allGames);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // --- Fetch Shop Items
        const shopResponse = await axios.get('https://gt-lax-app.web.app/shops.json');
        setShopItems(shopResponse.data);

        // --- Fetch Schedule (example for one season, e.g. "2024-25")
        const season = '2024-25';
        const rssURL = `https://www.gtlacrosse.com/sports/mlax/${season}/schedule?print=rss`;
        const scheduleResponse = await axios.get(rssURL);
        const parser = new XMLParser({ ignoreAttributes: false });
        const feed = parser.parse(scheduleResponse.data);
        const items = feed.rss.channel.item;
        const allGames = items.map((item: any) => ({
          title: item.title,
          link: item.link,
          description: item.description,
          category: item.category,
          pubDate: item.pubDate,
          opponent: item["ps:opponent"] || null,
          score: item["ps:score"] || null,
        }));
        setSchedule(allGames);

        // --- Fetch Roster
        const [jsonResp, csvResp] = await Promise.all([
          fetch('https://gt-lax-app.web.app/players.json'),
          fetch('https://gt-lax-app.web.app/players/theroster.csv'),
        ]);
        const jsonData = await jsonResp.json();
        const csvText = await csvResp.text();
        const parsedCSV = Papa.parse(csvText, { header: true }).data;

        const jsonMap = new Map<string, any>(jsonData.map((p: any) => [p.playerName, p]));
        const combinedRoster = await Promise.all(parsedCSV.map(async (player: any) => {
          const j = jsonMap.get(player['Name']);
          const imageUrl = j?.imageUrl || 'https://gt-lax-app.web.app/players/images/headshot_default.png';
          const localImageUrl = await getLocalImageUri(imageUrl);
          return {
            id: Number(player['#']),
            playerName: player['Name'],
            position: player['Pos'],
            number: Number(player['#']),
            year: player['year'] 
                   ? player['year'].charAt(0).toUpperCase() + player['year'].slice(1).toLowerCase() 
                   : '',
            imageUrl: localImageUrl,
            contentUrl: j?.contentUrl || 'https://gt-lax-app.web.app/players/bios/default_bio.md',
          };
        }));

        setRoster(combinedRoster);

        // --- Fetch Articles
        const articlesResp = await fetch('https://gt-lax-app.web.app/articles.json');
        const articlesData = await articlesResp.json();
        setArticles(articlesData.reverse());

        // Prefetch all images in the background
        const imagePromises = combinedRoster.map((player) => Image.prefetch(player.imageUrl));
        Promise.all(imagePromises);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // FCM Initialization
    const setupFCM = async () => {
      try {
        // Request user permissions
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Notification permission granted.');
          const token = await messaging().getToken();
          console.log('FCM Token:', token);

          // Optional: send the token to your backend
        }
      } catch (error) {
        console.error('Error initializing FCM:', error);
      }

      // Handle token refresh
      const unsubscribe = messaging().onTokenRefresh((newToken) => {
        console.log('FCM Token refreshed:', newToken);
        // Optional: send the refreshed token to your backend
      });

      return () => unsubscribe();
    };

    setupFCM();

    // Foreground Notification Listener
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('FCM Notification received in foreground:', remoteMessage);
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  return (
    <AppDataContext.Provider value={{
      shopItems,
      schedule,
      roster,
      articles,
      loading,
      fetchScheduleForSeason, // Expose for dynamic fetching
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);