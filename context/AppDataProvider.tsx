import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { XMLParser } from 'fast-xml-parser';

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

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [schedule, setSchedule] = useState<Game[]>([]);
  const [roster, setRoster] = useState<Player[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScheduleForSeason = async (season: string) => {
    setLoading(false);  // adds loading spinner if true (loads fast enough that it's not needed)
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
        const combinedRoster = parsedCSV.map((player: any) => {
          const j = jsonMap.get(player['Name']);
          return {
            id: Number(player['#']),
            playerName: player['Name'],
            position: player['Pos'],
            number: Number(player['#']),
            year: player['year'] 
                   ? player['year'].charAt(0).toUpperCase() + player['year'].slice(1).toLowerCase() 
                   : '',
            imageUrl: j?.imageUrl || 'https://gt-lax-app.web.app/players/images/headshot_default.png',
            contentUrl: j?.contentUrl || 'https://gt-lax-app.web.app/players/bios/default_bio.md',
          };
        });
        setRoster(combinedRoster);

        // --- Fetch Articles
        const articlesResp = await fetch('https://gt-lax-app.web.app/articles.json');
        const articlesData = await articlesResp.json();
        setArticles(articlesData.reverse());
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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