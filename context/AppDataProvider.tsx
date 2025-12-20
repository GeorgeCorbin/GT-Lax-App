import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { XMLParser } from 'fast-xml-parser';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNotificationApiKey } from '@/utils/config';
import { 
  fetchRSSFeed, 
  saveArticlesToFile, 
  loadArticlesFromFile, 
  mergeArticles,
  fetchRemoveAutoArticles,
  debugArticleDates,
  normalizeArticleDates,
  diagnoseAndFixDateIssues,
  MergeArticlesResult
} from '@/utils/articleUtils';
import localFeatureFlags from '@/local_feature_flags';

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

type GameInfo = {
  id: string;
  location: string;
  fieldImage: string;
  fieldName: string;
  latitude: number;
  longitude: number;
  conference?: string;
  region?: string;
  coverageText: string;
  coverageLink?: string;
};

type AppDataContextType = {
  shopItems: ShopItem[];
  schedule: Game[];
  roster: Player[];
  articles: Article[];
  loading: boolean;
  fetchScheduleForSeason: (season: string) => Promise<void>;
  fetchArticles: (forceRefresh?: boolean) => Promise<void>;
  fetchRoster?: () => Promise<void>;
  rankings: any[];
  loadingRankings: boolean;
};

const AppDataContext = createContext<AppDataContextType>({
  shopItems: [],
  schedule: [],
  roster: [],
  articles: [],
  loading: true,
  fetchScheduleForSeason: async () => {},
  fetchArticles: async () => {},
  fetchRoster: async () => {},
  rankings: [],
  loadingRankings: true,
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
    const apiKey = getNotificationApiKey();
    const response = await axios.post(
      "https://us-central1-gt-lax-app.cloudfunctions.net/sendPushNotification",
      { title, body, data: { screen: "Schedule" } },
      { 
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": apiKey 
        } 
      }
    );
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

let lastUsedRemoteTitleIndex = -1;
const fetchRemoteNotificationTitles = async (): Promise<string[] | null> => {
  try {
    const resp = await axios.get("https://gt-lax-app.web.app/auto_notification_titles.json");
    const data = resp.data;
    if (Array.isArray(data) && data.every((t) => typeof t === "string")) {
      return data as string[];
    }
    return null;
  } catch (_) {
    return null;
  }
};

const sendArticleNotification = async (newArticlesCount: number, articleTitles: string[] = []) => {
  try {
    const featureFlagsResponse = await axios.get("https://gt-lax-app.web.app/feature_flags.json");
    const featureFlags = featureFlagsResponse.data;
    
    if (!featureFlags?.automatic_article_notifications?.enabled) {
      console.log("Automatic article notifications feature is disabled, skipping notification");
      return;
    }
    
    if (newArticlesCount <= 0) {
      console.log("No new articles to notify about, skipping notification");
      return;
    }
    
    console.log(`Sending notification for ${newArticlesCount} new articles with titles:`, articleTitles);

    const remoteTitles = await fetchRemoteNotificationTitles();
    const titles = remoteTitles && remoteTitles.length > 0 ? remoteTitles : [];

    let title: string;
    if (titles.length > 0) {
      let idx: number;
      do {
        idx = Math.floor(Math.random() * titles.length);
      } while (idx === lastUsedRemoteTitleIndex && titles.length > 1);
      lastUsedRemoteTitleIndex = idx;
      title = titles[idx];
    } else {
      title = "GT Lacrosse Update";
    }

    let body = "";
    if (articleTitles && Array.isArray(articleTitles) && articleTitles.length > 0) {
      if (newArticlesCount === 1) {
        body = `New article: "${articleTitles[0]}"`;
      } else if (newArticlesCount === 2) {
        body = `New articles: "${articleTitles[0]}" and "${articleTitles[1]}"`;
      } else {
        const remaining = newArticlesCount - 2;
        body = `New articles: "${articleTitles[0]}", "${articleTitles[1]}" and ${remaining} more`;
      }
    } else {
      body = newArticlesCount === 1
        ? "Check out the latest news from the Yellow Jackets!"
        : `Check out ${newArticlesCount} new articles from the Yellow Jackets!`;
    }

    const notificationEndpoint = "https://us-central1-gt-lax-app.cloudfunctions.net/sendPushNotification";

    const apiKey = getNotificationApiKey();
    const response = await axios.post(
      notificationEndpoint,
      { title, body },
      { 
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": apiKey 
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    console.log("Article notification sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    // More detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx range
      console.error("Error sending article notification - server response:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error sending article notification - no response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error sending article notification - request setup error:", error.message);
    }
    return null;
  }
};

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [schedule, setSchedule] = useState<Game[]>([]);
  const [roster, setRoster] = useState<Player[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(true);

  const router = useRouter();

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

  const fetchArticles = useCallback(async (forceRefresh = false) => {
    try {
      // Pre-fetch the removal list to ensure it's available for filtering
      const removeAutoArticles = await fetchRemoveAutoArticles();
      console.log(`Fetched ${removeAutoArticles.length} articles to auto-remove in fetchArticles`);
      
      // Run diagnostics and fix any date issues
      console.log('Running article date diagnostics...');
      const hadDateIssues = await diagnoseAndFixDateIssues();
      if (hadDateIssues) {
        console.log('Fixed date issues found during diagnostics');
      }
      
      // Then normalize any stored articles with incorrect dates
      await normalizeArticleDates();
      
      if (forceRefresh) {
        // Fetch fresh data from RSS feed
        const newArticles = await fetchRSSFeed(removeAutoArticles);
        const existingArticles = await loadArticlesFromFile();
        const mergeResult = mergeArticles(existingArticles, newArticles, removeAutoArticles);
        
        if (localFeatureFlags.disable_article_logs.enabled) {
          // Debug date sorting before saving
          console.log('Debug dates (after merge):');
          debugArticleDates(mergeResult.mergedArticles);
        }
        // Send notification if new articles were found
        if (mergeResult.newArticlesFound.length > 0) {
          console.log(`Found ${mergeResult.newArticlesFound.length} new articles, sending notification`);
          const articleTitles = mergeResult.newArticlesFound.map(article => article.title);
          await sendArticleNotification(mergeResult.newArticlesFound.length, articleTitles);
        }
        
        await saveArticlesToFile(mergeResult.mergedArticles);
        setArticles(mergeResult.mergedArticles);
      } else {
        // Try to load from local file first
        const localArticles = await loadArticlesFromFile();
        
        if (localFeatureFlags.disable_article_logs.enabled) {
          // Debug local articles dates
          console.log('Debug dates (local articles):');
          debugArticleDates(localArticles);
        }
        
        if (localArticles.length > 0) {
          setArticles(localArticles);
          
          // Fetch new articles in the background
          const newArticles = await fetchRSSFeed(removeAutoArticles);
          const mergeResult = mergeArticles(localArticles, newArticles, removeAutoArticles);
          
          if (localFeatureFlags.disable_article_logs.enabled) {
            // Debug date sorting after merge
            console.log('Debug dates (after merge with new articles):');
            debugArticleDates(mergeResult.mergedArticles);
          }
          
          // Send notification if new articles were found
          if (mergeResult.newArticlesFound.length > 0) {
            console.log(`Found ${mergeResult.newArticlesFound.length} new articles, sending notification`);
            const articleTitles = mergeResult.newArticlesFound.map(article => article.title);
            await sendArticleNotification(mergeResult.newArticlesFound.length, articleTitles);
          }
          
          await saveArticlesToFile(mergeResult.mergedArticles);
          setArticles(mergeResult.mergedArticles);
        } else {
          // If no local data, fetch from RSS
          const newArticles = await fetchRSSFeed(removeAutoArticles);
          
          if (localFeatureFlags.disable_article_logs.enabled) {
            // Debug date sorting for new articles
            console.log('Debug dates (new articles only):');
            debugArticleDates(newArticles);
          }
          
          await saveArticlesToFile(newArticles);
          setArticles(newArticles);
        }
      }
      console.log('Fetched articles');
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }, []);
  

  const fetchRoster = useCallback(async () => {
    try {
      const [jsonResp, csvResp] = await Promise.all([
        fetch('https://gt-lax-app.web.app/players.json'),
        fetch('https://gt-lax-app.web.app/players/theroster.csv'),
      ]);
      const jsonData = await jsonResp.json();
      const csvText = await csvResp.text();
      const parsedCSV = Papa.parse(csvText, { header: true }).data;
  
      const jsonMap = new Map<string, any>(jsonData.map((p: any) => [p.playerName, p]));
      const combinedRoster = await Promise.all(
        parsedCSV.map(async (player: any) => {
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
        })
      );
  
      setRoster(combinedRoster);

      // Prefetch all images in the background
      const imagePromises = combinedRoster.map((player) => Image.prefetch(player.imageUrl));
      Promise.all(imagePromises);

    } catch (error) {
      console.error('Error fetching roster:', error);
    }
  }, []); // Empty dependency array ensures stability  

  useEffect(() => {
    const checkNotificationPermissions = async () => {
      const hasCompletedSetup = await AsyncStorage.getItem("hasCompletedNotificationSetup");

      if (!hasCompletedSetup) {
        router.replace("/RequestNotificationScreen");
      }
    };

    const fetchRankings = async () => {
      try {
        const response = await axios.get('https://gt-lax-app.web.app/current_rankings.json');
        setRankings(response.data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoadingRankings(false);
      }
    };

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
        await fetchRoster();
        
        // --- Fetch Articles
        // const articlesResp = await fetch('https://gt-lax-app.web.app/articles.json');
        // const articlesData = await articlesResp.json();
        // setArticles(articlesData.reverse());

        // --- Fetch Articles
        // await fetchArticles();

        // --- Fetch Rankings
        fetchRankings();

        // Prefetch all images in the background
      //   const imagePromises = combinedRoster.map((player) => Image.prefetch(player.imageUrl));
      //   Promise.all(imagePromises);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData(); 

    // Register and handle notifications
    checkNotificationPermissions();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Listen for notification interactions
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      // const { screen } = notification.request.content.data;

      // if (screen) {
      //   // Navigate using expo-router
      //   router.push(screen); // Dynamically navigate to the appropriate screen
      // }
      console.log('Notification received:', notification);
    });

    return () => subscription.remove();
  }, [router]);

  return (
    <AppDataContext.Provider value={{
      shopItems,
      schedule,
      roster,
      articles,
      loading,
      fetchScheduleForSeason, // Expose for dynamic fetching
      fetchArticles, // Expose for dynamic fetching
      fetchRoster, // Expose for dynamic fetching
      rankings,
      loadingRankings,
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);