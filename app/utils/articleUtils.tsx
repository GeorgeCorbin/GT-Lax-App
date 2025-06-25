import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import * as FileSystem from 'expo-file-system';

// Define a type for remove auto articles
type RemoveAutoArticle = {
  title: string;
  date: string;
};

export type Article = {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  imageAuthor: string;
  contentUrl: string;
  content?: string; // Optional content field for local storage
};

// Helper function to convert date string to timestamp for sorting
export const getDateTimestamp = (dateStr: string): number => {
  const normalizedDateStr = dateStr.trim();
  
  try {
    const standardFormat = normalizedDateStr.match(/([A-Za-z]+)\.?\s+(\d+),\s+(\d+)/);
    if (standardFormat) {
      const [_, month, day, year] = standardFormat;
      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'January': 0,
        'Feb': 1, 'February': 1,
        'Mar': 2, 'March': 2,
        'Apr': 3, 'April': 3,
        'May': 4, 
        'Jun': 5, 'June': 5,
        'Jul': 6, 'July': 6,
        'Aug': 7, 'August': 7,
        'Sep': 8, 'Sept': 8, 'September': 8,
        'Oct': 9, 'October': 9,
        'Nov': 10, 'November': 10,
        'Dec': 11, 'December': 11
      };
      
      const normalizedMonth = month.replace(/\.$/, '');
      const monthIndex = monthMap[normalizedMonth];
      const dayNum = parseInt(day, 10);
      const yearNum = parseInt(year, 10);
      
      // Validate date components
      if (monthIndex === undefined || isNaN(dayNum) || isNaN(yearNum)) {
        return new Date().getTime();
      }
      
      // Check bounds for year (reasonable range for articles)
      if (yearNum < 2000 || yearNum > 2100) {
        return new Date().getTime();
      }
      
      // Check bounds for day (1-31)
      if (dayNum < 1 || dayNum > 31) {
        return new Date().getTime();
      }
      
      try {
        // Create date with bounds checking
        const safeDate = new Date(yearNum, monthIndex, Math.min(dayNum, 31));
        
        // Verify the date is valid
        if (safeDate.getMonth() === monthIndex && 
            safeDate.getFullYear() === yearNum && 
            safeDate.getDate() <= dayNum) {
          return safeDate.getTime();
        }
      } catch (e) {
        // Fall through to return current date
      }
    }
    
    // Fallback to current date
    return new Date().getTime();
  } catch (e) {
    return new Date().getTime();
  }
};

export const fetchArticleContent = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    
    // Log the raw HTML to check for paragraph breaks
    console.log("HTML contains paragraph divs:", html.includes('<div>&nbsp;</div>'));
    
    // First, handle empty paragraph divs by converting them to explicit paragraph markers
    let processedHtml = html.replace(/<div>\s*&nbsp;\s*<\/div>/g, '<div>PARAGRAPH_BREAK</div>');
    
    // Extract the main content using the specific HTML structure
    const contentMatch = processedHtml.match(/<div class="article-body">(.*?)<\/div>\s*<div class="article-footer/s);
    
    if (contentMatch && contentMatch[1]) {
      let content = contentMatch[1];
      
      // Remove unwanted sections
      content = content
        .replace(/<div class="article-scores.*?<\/div>/s, '')
        .replace(/<div class="related-links.*?<\/div>/s, '')
        .replace(/<div class="sidebar.*?<\/div>\s*<\/div>\s*<\/div>/gs, '')
        .replace(/<div class="sidebar article-sidebar.*?<\/div>\s*<\/div>\s*<\/div>/gs, '')
        .replace(/<div class="article-gallery.*?<\/div>/s, '')
        .replace(/<div class="brief-stats.*?<\/div>\s*<\/div>\s*<\/div>/gs, '')
        .replace(/<div class="stats-box.*?<\/div>\s*<\/div>\s*<\/div>/gs, '')
        .replace(/<div class="card-header.*?Team Stats.*?<\/table>.*?<\/div>/gs, '')
        .replace(/Game Leaders.*?Full stats/gs, '');
      
      // Improved handling of player links - preserve both roster links and other links
      content = content
        // First handle player name links with relative paths (e.g., /roster/player-name)
        .replace(/<a\s+href="(\/roster\/[^"]+)"[^>]*>([^<]+)<\/a>/g, (match: string, path: string, name: string) => {
          console.log(`Converting player link: ${name} -> ${path}`);
          return `[${name}](${path})`;
        })
        // Then handle player name links with absolute paths
        .replace(/<a\s+href="(https?:\/\/[^"]+\/roster\/[^"]+)"[^>]*>([^<]+)<\/a>/g, (match: string, url: string, name: string) => {
          // Extract just the /roster/player-name part for internal navigation
          const playerPath = url.match(/\/roster\/[^/?"]+/);
          if (playerPath) {
            console.log(`Converting absolute player link: ${name} -> ${playerPath[0]}`);
            return `[${name}](${playerPath[0]})`;
          }
          // Fallback to full URL if pattern doesn't match
          console.log(`Could not extract player path from URL: ${url}, using full URL`);
          return `[${name}](${url})`;
        })
        // Then handle all other links
        .replace(/<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g, (match: string, url: string, name: string) => {
          console.log(`Converting regular link: ${name} -> ${url}`);
          return `[${name}](${url})`;
        });
      
      // Handle explicit paragraph breaks
      const paragraphs = content.split('<div>PARAGRAPH_BREAK</div>');
      
      // Process each paragraph - clean up HTML and convert to plain text
      const processedParagraphs = paragraphs.map((paragraph: string) => {
        return paragraph
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<p>/gi, '')
          .replace(/<\/p>/gi, '')
          .replace(/<div>/gi, '')
          .replace(/<\/div>/gi, '')
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/\s+/g, ' ')
          .trim();
      });
      
      // Join processed paragraphs with two newlines for proper markdown paragraphs
      const finalContent = processedParagraphs.join('\n\n');
      console.log("Final content paragraph count:", processedParagraphs.length);
      
      return finalContent;
    }
    
    // Fallback: try to get content from article-text if the first method fails
    const altContentMatch = processedHtml.match(/<div class="article-text[^>]*>(.*?)<div class="article-footer/s);
    if (altContentMatch && altContentMatch[1]) {
      let content = altContentMatch[1];
      
      // Remove unwanted sections
      content = content
        .replace(/<div class="article-date">.*?<\/div>/s, '')
        .replace(/<h1 class="article-title">.*?<\/h1>/s, '')
        .replace(/<div class="sidebar.*?<\/div>\s*<\/div>\s*<\/div>/gs, '')
        .replace(/<div class="brief-stats.*?<\/div>\s*<\/div>\s*<\/div>/gs, '')
        .replace(/<div class="stats-box.*?<\/div>\s*<\/div>\s*<\/div>/gs, '')
        .replace(/Game Leaders.*?Full stats/gs, '');
      
      // Improved handling of player links - preserve both roster links and other links
      content = content
        // First handle player name links with relative paths
        .replace(/<a\s+href="(\/roster\/[^"]+)"[^>]*>([^<]+)<\/a>/g, (match: string, path: string, name: string) => {
          console.log(`Found player link: ${name} -> ${path}`);
          return `[${name}](${path})`;
        })
        // Then handle player name links with absolute paths
        .replace(/<a\s+href="(https?:\/\/[^"]+\/roster\/[^"]+)"[^>]*>([^<]+)<\/a>/g, (match: string, url: string, name: string) => {
          // Extract just the /roster/player-name part for internal navigation
          const playerPath = url.match(/\/roster\/[^/?"]+/);
          if (playerPath) {
            console.log(`Found absolute player link: ${name} -> ${playerPath[0]}`);
            return `[${name}](${playerPath[0]})`;
          }
          // Fallback to full URL if pattern doesn't match
          return `[${name}](${url})`;
        })
        // Then handle all other links
        .replace(/<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g, (match: string, url: string, name: string) => `[${name}](${url})`);
      
      // Handle explicit paragraph breaks
      const paragraphs = content.split('<div>PARAGRAPH_BREAK</div>');
      
      // Process each paragraph - clean up HTML and convert to plain text
      const processedParagraphs = paragraphs.map((paragraph: string) => {
        return paragraph
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<p>/gi, '')
          .replace(/<\/p>/gi, '')
          .replace(/<div>/gi, '')
          .replace(/<\/div>/gi, '')
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/\s+/g, ' ')
          .trim();
      });
      
      // Join processed paragraphs with two newlines for proper markdown paragraphs
      const finalContent = processedParagraphs.join('\n\n');
      
      return finalContent;
    }
    
    return '';
  } catch (error) {
    console.error('Error fetching article content:', error);
    return '';
  }
};

// Helper function to check if an article is older than 2 years
const isArticleTooOld = (dateStr: string): boolean => {
  try {
    // Use our improved date parsing function
    const timestamp = getDateTimestamp(dateStr);
    if (timestamp === 0) {
      console.error('Could not parse date for age check:', dateStr);
      return false;
    }
    
    const articleDate = new Date(timestamp);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    return articleDate < twoYearsAgo;
  } catch (error) {
    console.error('Error checking article age:', error);
    return false; // Default to keeping the article if there's an error
  }
};

// Helper function to check if an article is a commitment or transfer announcement
const isCommitmentOrTransferArticle = (title: string): boolean => {
  const lowerTitle = title.toLowerCase();
  return lowerTitle.includes('commits to georgia tech') || 
         lowerTitle.includes('commit to georgia tech') ||
         lowerTitle.includes('transfers to georgia tech') ||
         lowerTitle.includes('transfer to georgia tech');
};

// Interface for RSS feed items
interface RSSFeedItem {
  title: string;
  pubDate: string;
  link: string;
  'media:content'?: {
    '@_url'?: string;
    url?: string;
  };
  enclosure?: {
    '@_url'?: string;
    url?: string;
  };
}

// Helper function to generate a unique ID for an article
const generateArticleId = (title: string, date: string): number => {
  // Create a string combining title and date
  const combined = `${title}-${date}`;
  // Create a hash of the string
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Make sure the hash is positive
  return Math.abs(hash);
};

// Function to fetch articles to auto-remove from Firebase
export const fetchRemoveAutoArticles = async (): Promise<RemoveAutoArticle[]> => {
  try {
    console.log('Fetching auto-remove article list from Firebase...');
    const response = await axios.get('https://gt-lax-app.web.app/remove_auto_article.json');
    
    if (response.data && Array.isArray(response.data)) {
      // Validate that each item has the required fields
      const validArticles = response.data.filter(item => {
        if (!item.title || !item.date) {
          console.error('Invalid remove-auto article format, missing title or date:', JSON.stringify(item));
          return false;
        }
        return true;
      });
      
      console.log(`Fetched ${validArticles.length} valid articles to auto-remove:`);
      validArticles.forEach(article => {
        console.log(`- Title: "${article.title}", Date: "${article.date}"`);
      });
      
      return validArticles;
    } else {
      console.error('Invalid response format for auto-remove articles:', typeof response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching auto-remove articles:', error);
    return [];
  }
};

// Helper function to check if an article should be auto-removed
const shouldAutoRemoveArticle = (article: Article, removeList: RemoveAutoArticle[]): boolean => {
  if (!removeList || removeList.length === 0) {
    return false;
  }
  
  // Normalize article date for comparison (remove any extra spaces or commas)
  const normalizedArticleDate = article.date.replace(/\s+/g, ' ').trim();
  const normalizedArticleTitle = article.title.trim();
  
  return removeList.some(removeItem => {
    // Check title first - must be an exact match (after trimming)
    const titleMatch = normalizedArticleTitle === removeItem.title.trim();
    
    if (!titleMatch) {
      return false;
    }
    
    // Then try several date matching strategies
    
    // 1. Direct string match
    if (normalizedArticleDate === removeItem.date.trim()) {
      console.log(`Found exact date match for "${article.title}": ${article.date}`);
      return true;
    }
    
    // 2. Normalized format match (convert both to timestamps and compare)
    try {
      const articleTimestamp = getDateTimestamp(article.date);
      const removeItemTimestamp = getDateTimestamp(removeItem.date);
      
      // If both timestamps are valid, compare them
      if (articleTimestamp > 0 && removeItemTimestamp > 0) {
        // Create Date objects to compare just the date portion (ignoring time)
        const articleDate = new Date(articleTimestamp);
        const removeDate = new Date(removeItemTimestamp);
        
        // Set time components to 0 for proper date comparison
        articleDate.setHours(0, 0, 0, 0);
        removeDate.setHours(0, 0, 0, 0);
        
        if (articleDate.getTime() === removeDate.getTime()) {
          console.log(`Found date timestamp match for "${article.title}": ${article.date} ≈ ${removeItem.date}`);
          return true;
        }
      }
    } catch (e) {
      console.error(`Error comparing dates for auto-removal of "${article.title}":`, e);
    }
    
    return false;
  });
};

export const fetchRSSFeed = async (removeAutoArticles: RemoveAutoArticle[] = []): Promise<Article[]> => {
  try {
    console.log('Fetching RSS feed...');
    const rssURL = 'https://www.gtlacrosse.com/landing/headlines-featured?print=rss';
    
    // If no remove list was provided, fetch it
    if (removeAutoArticles.length === 0) {
      console.log('No remove list provided to fetchRSSFeed, fetching it now...');
      removeAutoArticles = await fetchRemoveAutoArticles();
    }
    
    const response = await axios.get(rssURL);
    console.log('RSS feed response received');
    
    const parser = new XMLParser({ ignoreAttributes: false });
    const feed = parser.parse(response.data);
    
    console.log('Feed parsed, items:', feed.rss?.channel?.item?.length);
    
    if (!feed.rss || !feed.rss.channel || !feed.rss.channel.item) {
      console.error('Invalid RSS feed structure:', JSON.stringify(feed, null, 2));
      return [];
    }
    
    const items: RSSFeedItem[] = Array.isArray(feed.rss.channel.item) 
      ? feed.rss.channel.item 
      : [feed.rss.channel.item];
    
    // Use static data for testing if RSS feed doesn't contain valid data
    if (items.length === 0 || !items[0].title) {
      console.log('Using static test data instead of empty RSS feed');
      const testDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const testTitle = 'Test Article 1';
      return [
        {
          id: generateArticleId(testTitle, testDate),
          title: testTitle,
          date: testDate,
          imageUrl: 'https://gt-lax-app.web.app/assets/article1.jpg',
          imageAuthor: 'Kevin Schoonover',
          contentUrl: 'https://gt-lax-app.web.app/assets/article1.md',
          content: 'Test article content'
        }
      ];
    }
    
    const articles: Article[] = await Promise.all(
      items
        .filter(item => !isCommitmentOrTransferArticle(item.title)) // Filter out commitment and transfer announcements
        .map(async (item: RSSFeedItem) => {
          // Format the date from RSS format to our desired format
          let formattedDate = '';
          try {
            // RSS dates typically come in RFC 2822 format, e.g., "Wed, 14 Jun 2023 12:00:00 GMT"
            // First check if we can parse it as a valid date
            const pubDate = new Date(item.pubDate);
            
            if (isNaN(pubDate.getTime())) {
              console.error(`Invalid RSS pubDate: "${item.pubDate}"`);
              // Use current date as fallback
              const today = new Date();
              formattedDate = today.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
            } else {
              // Valid date - format it consistently
              const year = pubDate.getFullYear();
              const day = pubDate.getDate();
              const monthIndex = pubDate.getMonth();
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              
              // Use direct string construction for consistent format
              formattedDate = `${months[monthIndex]} ${day}, ${year}`;
              
              // Double-check with a regex to ensure it matches our expected format
              if (!/^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}$/.test(formattedDate)) {
                console.warn(`Date format validation failed: "${formattedDate}" from "${item.pubDate}"`);
                // Try again with toLocaleDateString as backup
                try {
                  formattedDate = pubDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                } catch (e) {
                  console.error(`toLocaleDateString failed: ${e}`);
                  // Last resort fallback
                  formattedDate = `Jan 1, ${year}`;
                }
              }
            }
          } catch (e) {
            console.error(`Error formatting date "${item.pubDate}":`, e);
            // Fallback to today's date
            const today = new Date();
            const year = today.getFullYear();
            const day = today.getDate();
            const monthIndex = today.getMonth();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            formattedDate = `${months[monthIndex]} ${day}, ${year}`;
          }

          // Get the full size image URL by removing the size parameters
          const rawImageUrl = item['media:content']?.['@_url'] || 
                          item['media:content']?.url || 
                          item.enclosure?.['@_url'] || 
                          item.enclosure?.url || 
                          '';
          
          // Check if we got a valid image URL
          //   console.log(`Article "${item.title}" raw image URL:`, rawImageUrl);
          
          // Clean up the URL if needed
          const imageUrl = rawImageUrl.replace(/\?max_width=\d+&max_height=\d+/, '');
          //   console.log(`Article "${item.title}" cleaned image URL:`, imageUrl);
          
          // Use a default image if no valid image URL is available
          const finalImageUrl = imageUrl || 'https://gt-lax-app.web.app/assets/default-article.jpg';
          //   console.log(`Article "${item.title}" final image URL:`, finalImageUrl);

          // Fetch article content directly from the article URL
          const content = await fetchArticleContent(item.link);

          return {
            id: generateArticleId(item.title, formattedDate),
            title: item.title,
            date: formattedDate,
            imageUrl: finalImageUrl,
            imageAuthor: 'Kevin Schoonover', // Default author, can be updated if available in RSS
            contentUrl: item.link,
            content: content
          };
        })
    );

    // Sort articles by date (newest first)
    const sortedArticles = articles
      .sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date))
      // Filter out articles in the remove auto list
      .filter(article => {
        const shouldRemove = shouldAutoRemoveArticle(article, removeAutoArticles);
        if (shouldRemove) {
          console.log(`Removing article from RSS feed: "${article.title}" (${article.date})`);
        }
        return !shouldRemove;
      });
      
    console.log('Articles sorted and filtered, returning:', sortedArticles.length);
    
    return sortedArticles;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    console.log('Using fallback static data due to error');
    const testDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const testTitle = 'Test Article 1';
    return [
      {
        id: generateArticleId(testTitle, testDate),
        title: testTitle,
        date: testDate,
        imageUrl: 'https://gt-lax-app.web.app/assets/article1.jpg',
        imageAuthor: 'Kevin Schoonover',
        contentUrl: 'https://gt-lax-app.web.app/assets/article1.md',
        content: 'Test article content'
      }
    ];
  }
};

export const saveArticlesToFile = async (articles: Article[]): Promise<void> => {
  try {
    const articlesJson = JSON.stringify(articles, null, 2);
    const filePath = `${FileSystem.documentDirectory}articles.json`;
    await FileSystem.writeAsStringAsync(filePath, articlesJson);
  } catch (error) {
    console.error('Error saving articles:', error);
  }
};

export const loadArticlesFromFile = async (): Promise<Article[]> => {
  try {
    const filePath = `${FileSystem.documentDirectory}articles.json`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    
    if (!fileInfo.exists) {
      return [];
    }

    const articlesJson = await FileSystem.readAsStringAsync(filePath);
    return JSON.parse(articlesJson);
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
};

export const mergeArticles = (existingArticles: Article[], newArticles: Article[], removeAutoArticles: RemoveAutoArticle[] = []): Article[] => {
  console.log(`Using auto-remove list with ${removeAutoArticles.length} articles in mergeArticles`);
  if (removeAutoArticles.length > 0) {
    console.log('Articles to remove:', JSON.stringify(removeAutoArticles));
  }
  
  // Filter out articles older than 2 years from existing articles
  const filteredExistingArticles = existingArticles
    .filter(article => !isArticleTooOld(article.date))
    .filter(article => !isCommitmentOrTransferArticle(article.title))
    .filter(article => {
      const shouldRemove = shouldAutoRemoveArticle(article, removeAutoArticles);
      if (shouldRemove) {
        console.log(`Removing article from existing: "${article.title}" (${article.date})`);
      }
      return !shouldRemove;
    });
  
  // Create a map of existing articles by contentUrl for quick lookup
  const existingMap = new Map(filteredExistingArticles.map(article => [article.contentUrl, article]));
  
  // Merge new articles with existing ones
  const mergedArticles = newArticles
    .filter(article => !isCommitmentOrTransferArticle(article.title))
    .filter(article => {
      const shouldRemove = shouldAutoRemoveArticle(article, removeAutoArticles);
      if (shouldRemove) {
        console.log(`Removing article from new: "${article.title}" (${article.date})`);
      }
      return !shouldRemove;
    })
    .map(newArticle => {
      const existingArticle = existingMap.get(newArticle.contentUrl);
      
      if (existingArticle) {
        // If article exists, preserve its content if new article doesn't have it
        return {
          ...newArticle,
          content: newArticle.content || existingArticle.content
        };
      }
      
      return newArticle;
    });

  // Add any existing articles that aren't in the new feed (and aren't too old)
  filteredExistingArticles.forEach(existingArticle => {
    if (!newArticles.some(newArticle => newArticle.contentUrl === existingArticle.contentUrl)) {
      mergedArticles.push(existingArticle);
    }
  });

  console.log('Before sorting, article dates:', mergedArticles.map(a => ({ title: a.title.substring(0, 20), date: a.date })));
  // Sort merged articles by date (newest first) with error handling
  const sortedArticles = mergedArticles.sort((a, b) => {
    try {
      const timestampA = getDateTimestamp(a.date);
      const timestampB = getDateTimestamp(b.date);
      
      // Debug any potential sorting issues
      if (isNaN(timestampA) || isNaN(timestampB)) {
        console.error(`Invalid timestamp(s) during sorting: Article A: "${a.title}" (${a.date}) = ${timestampA}, Article B: "${b.title}" (${b.date}) = ${timestampB}`);
        // Default to preserving original order if we can't determine
        return 0;
      }
      
      return timestampB - timestampA;
    } catch (error) {
      console.error(`Error during article sorting between "${a.title}" and "${b.title}":`, error);
      // Default to preserving original order if there's an error
      return 0; 
    }
  });
  console.log('After sorting, article dates:', sortedArticles.map(a => ({ title: a.title.substring(0, 20), date: a.date })));
  
  return sortedArticles;
};

// Add this debug function after mergeArticles function
export const debugArticleDates = (articles: Article[]): void => {
  console.log('====== DEBUGGING ARTICLE DATES ======');
  console.log(`Total articles: ${articles.length}`);
  
  if (articles.length === 0) {
    console.log('No articles to analyze');
    console.log('====== END DEBUG ======');
    return;
  }
  
  // Original sort order
  console.log('\nArticles in their original order:');
  articles.forEach((article, index) => {
    console.log(`${index + 1}. "${article.title}" - Date: ${article.date}`);
  });
  
  // Sort using our custom getDateTimestamp function
  const customSorted = [...articles].sort((a, b) => {
    try {
      const timestampA = getDateTimestamp(a.date);
      const timestampB = getDateTimestamp(b.date);
      return timestampB - timestampA; // newest first
    } catch (error) {
      console.error(`Error sorting articles: "${a.title}" (${a.date}) vs "${b.title}" (${b.date}):`, error);
      return 0;
    }
  });
  
  console.log('\nArticles sorted by date (newest first):');
  customSorted.forEach((article, index) => {
    try {
      const timestamp = getDateTimestamp(article.date);
      const date = new Date(timestamp);
      console.log(`${index + 1}. "${article.title}" - Date: ${article.date} -> Timestamp: ${timestamp}`);
    } catch (error) {
      console.error(`Error processing article: "${article.title}" (${article.date}):`, error);
    }
  });
  
  // Look for potential problematic dates
  console.log('\nChecking for potentially problematic dates:');
  let problemCount = 0;
  
  articles.forEach(article => {
    const dateStr = article.date;
    
    // Check standard format
    const standardFormat = dateStr.match(/^([A-Za-z]+)\.?\s+(\d+),\s+(\d+)$/);
    if (!standardFormat) {
      console.error(`❌ Invalid date format: "${dateStr}" in article "${article.title}"`);
      problemCount++;
      return;
    }
    
    const [_, month, day, year] = standardFormat;
    const normalizedMonth = month.replace(/\.$/, ''); // Remove trailing period if present
    
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'January': 0,
      'Feb': 1, 'February': 1,
      'Mar': 2, 'March': 2,
      'Apr': 3, 'April': 3,
      'May': 4, 
      'Jun': 5, 'June': 5,
      'Jul': 6, 'July': 6,
      'Aug': 7, 'August': 7,
      'Sep': 8, 'Sept': 8, 'September': 8,
      'Oct': 9, 'October': 9,
      'Nov': 10, 'November': 10,
      'Dec': 11, 'December': 11
    };
    
    if (!monthMap.hasOwnProperty(normalizedMonth)) {
      console.error(`❌ Unknown month: "${normalizedMonth}" in date "${dateStr}" for article "${article.title}"`);
      problemCount++;
    }
  });
  
  if (problemCount === 0) {
    console.log('✓ All dates appear to be in the correct format');
  } else {
    console.log(`❌ Found ${problemCount} problematic dates`);
  }
  
  console.log('====== END DEBUG ======');
};

// Add this function after debugArticleDates
export const normalizeArticleDates = async (): Promise<void> => {
  console.log('Normalizing article dates in stored articles');
  
  try {
    // Load existing articles
    const articles = await loadArticlesFromFile();
    
    if (!articles || articles.length === 0) {
      console.log('No articles found to normalize');
      return;
    }
    
    console.log(`Found ${articles.length} articles to check`);
    
    // Map of article IDs to normalize
    const articlesToFix: { [id: number]: string } = {};
    
    // Check each article date and identify articles needing normalization
    articles.forEach(article => {
      const { id, title, date } = article;
      
      // Skip articles with empty dates
      if (!date || date.trim() === '') {
        console.error(`Article "${title}" (ID: ${id}) has empty date, skipping normalization`);
        return;
      }
      
      // Check if the date needs normalization
      let needsFixing = false;
      
      // Check for standard format "MMM D, YYYY"
      if (!/^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}$/.test(date.trim())) {
        console.log(`Article "${title}" (ID: ${id}) has non-standard date format: "${date}"`);
        needsFixing = true;
      }
      
      if (needsFixing) {
        try {
          // Try to parse the date and format it correctly
          const timestamp = getDateTimestamp(date);
          if (timestamp > 0) {
            // Use direct formatting for consistency
            const normalizedDate = new Date(timestamp);
            const year = normalizedDate.getFullYear();
            const day = normalizedDate.getDate();
            const monthIndex = normalizedDate.getMonth();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const newDate = `${months[monthIndex]} ${day}, ${year}`;
            
            articlesToFix[id] = newDate;
            console.log(`Will normalize date: "${date}" -> "${newDate}" for article "${title}"`);
          } else {
            console.error(`Could not parse date "${date}" for article "${title}", using current date`);
            // Use current date as fallback
            const today = new Date();
            const year = today.getFullYear();
            const day = today.getDate();
            const monthIndex = today.getMonth();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            articlesToFix[id] = `${months[monthIndex]} ${day}, ${year}`;
          }
        } catch (e) {
          console.error(`Error normalizing date for article "${title}":`, e);
          // Use current date as fallback
          const today = new Date();
          const year = today.getFullYear();
          const day = today.getDate();
          const monthIndex = today.getMonth();
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          articlesToFix[id] = `${months[monthIndex]} ${day}, ${year}`;
        }
      }
    });
    
    // Apply fixes if needed
    const fixCount = Object.keys(articlesToFix).length;
    if (fixCount > 0) {
      console.log(`Fixing dates for ${fixCount} articles`);
      
      // Update articles with normalized dates
      const updatedArticles = articles.map(article => {
        if (articlesToFix[article.id]) {
          return {
            ...article,
            date: articlesToFix[article.id]
          };
        }
        return article;
      });
      
      // Save updated articles
      await saveArticlesToFile(updatedArticles);
      console.log(`Successfully normalized ${fixCount} article dates`);
      
      // Debug final result
      debugArticleDates(updatedArticles);
    } else {
      console.log('All article dates are in the correct format');
    }
  } catch (error) {
    console.error('Error normalizing article dates:', error);
  }
};

// Add after the debugArticleDates function
export const diagnoseAndFixDateIssues = async (): Promise<boolean> => {
  console.log('Running diagnostic check for date parsing issues');
  
  try {
    // Load articles
    const articles = await loadArticlesFromFile();
    
    if (!articles || articles.length === 0) {
      console.log('No articles to diagnose');
      return false;
    }
    
    console.log(`Checking ${articles.length} articles for date issues`);
    
    let hasIssues = false;
    let fixedArticles = [...articles];
    
    // Test each article's date parsing
    articles.forEach((article, index) => {
      try {
        const { id, title, date } = article;
        console.log(`Testing article ${index + 1}/${articles.length}: "${title}" (${date})`);
        
        // Skip empty dates
        if (!date || date.trim() === '') {
          console.error(`Article has empty date: "${title}" (ID: ${id})`);
          hasIssues = true;
          
          // Fix: Set current date
          const today = new Date();
          const year = today.getFullYear();
          const day = today.getDate();
          const monthIndex = today.getMonth();
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          fixedArticles[index] = {
            ...article,
            date: `${months[monthIndex]} ${day}, ${year}`
          };
          return;
        }
        
        // Try parsing with our function
        try {
          const timestamp = getDateTimestamp(date);
          
          if (timestamp === 0 || isNaN(timestamp)) {
            console.error(`Failed to parse date "${date}" for article "${title}" (ID: ${id})`);
            hasIssues = true;
            
            // Fix: Set current date
            const today = new Date();
            const year = today.getFullYear();
            const day = today.getDate();
            const monthIndex = today.getMonth();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            fixedArticles[index] = {
              ...article,
              date: `${months[monthIndex]} ${day}, ${year}`
            };
          } else {
            // Validate format
            if (!/^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}$/.test(date.trim())) {
              console.warn(`Article "${title}" has non-standard date format: "${date}"`);
              hasIssues = true;
              
              // Fix: Normalize to standard format
              const parsedDate = new Date(timestamp);
              const year = parsedDate.getFullYear();
              const day = parsedDate.getDate();
              const monthIndex = parsedDate.getMonth();
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              fixedArticles[index] = {
                ...article,
                date: `${months[monthIndex]} ${day}, ${year}`
              };
            }
          }
        } catch (error) {
          console.error(`Error testing date "${date}" for article "${title}":`, error);
          hasIssues = true;
          
          // Fix: Set current date
          const today = new Date();
          const year = today.getFullYear();
          const day = today.getDate();
          const monthIndex = today.getMonth();
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          fixedArticles[index] = {
            ...article,
            date: `${months[monthIndex]} ${day}, ${year}`
          };
        }
      } catch (error) {
        console.error(`Unexpected error diagnosing article:`, error);
        hasIssues = true;
      }
    });
    
    if (hasIssues) {
      console.log('Date issues detected, saving fixed articles');
      await saveArticlesToFile(fixedArticles);
      return true;
    } else {
      console.log('No date issues detected');
      return false;
    }
    
  } catch (error) {
    console.error('Error in diagnoseAndFixDateIssues:', error);
    return false;
  }
}; 