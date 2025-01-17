import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { XMLParser } from 'fast-xml-parser';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
import * as Notifications from 'expo-notifications';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Adjust the path based on your project structure

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

const sendNotificationToAllUsers = async (title: string, body: string) => {
  try {
    const response = await axios.post(
      "https://us-central1-gt-lax-app.cloudfunctions.net/sendPushNotification",
      { title, body },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
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

  async function registerForPushNotificationsAsync() {
    let token;
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Push notifications permission denied.');
      return;
    }
  
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
  
    // Save the token to Firestore
    try {
      const docRef = doc(db, "expoTokens", token);
      await setDoc(docRef, { token, timestamp: new Date() });
      console.log('Token stored in Firestore.');
    } catch (error) {
      console.error('Error storing token in Firestore:', error);
    }
  
    return token;
  }

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

    // Register and handle notifications
    registerForPushNotificationsAsync();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    return () => subscription.remove();
  }, []);

  return (
    <AppDataContext.Provider value={{
      shopItems,
      schedule,
      roster,
      articles,
      loading,
      fetchScheduleForSeason, // Expose for dynamic fetching
      // sendNotificationToAllUsers, // Expose for sending notifications
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);