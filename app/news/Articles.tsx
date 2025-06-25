import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Markdown from 'react-native-markdown-display';
import Colors from '@/constants/Colors'; // Ensure this path is correct
import { useLocalSearchParams, router } from 'expo-router';
import styles from '../../constants/styles/news'; // Updated path for styles
import { fetchArticleContent } from '../utils/articleUtils';

interface Article {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  imageAuthor: string;
  contentUrl: string;
  contentAuthor?: string;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

// Handle link press events
const handleLinkPress = (url: string) => {
  console.log('Link pressed:', url);
  
  // Check if it's a roster/bio link
  if (url.includes('/roster/') || url.includes('/bios/')) {
    console.log('Detected player link:', url);
    
    // Extract player slug from the URL
    let playerSlug;
    const rosterMatch = url.match(/\/roster\/([^/]+)/);
    const biosMatch = url.match(/\/bios\/([^/?]+)/);
    
    if (rosterMatch && rosterMatch[1]) {
      playerSlug = rosterMatch[1];
    } else if (biosMatch && biosMatch[1]) {
      // For bio URLs like "belli_andrew_foxk", extract the player name parts
      const nameParts = biosMatch[1].split('_');
      
      if (nameParts.length >= 2) {
        // Check if it's in format "lastname_firstname" (like "belli_andrew")
        // Rearrange to "firstname-lastname" for matching with our player data
        playerSlug = `${nameParts[1]}-${nameParts[0]}`;
        console.log('Formatted bio URL slug:', playerSlug);
      } else {
        // Fallback to just using the first part
        playerSlug = nameParts[0];
      }
    }
    
    if (playerSlug) {
      console.log('Extracted player slug:', playerSlug);
      
      // Navigate to player profile
      console.log('Navigating to:', `/roster/${playerSlug}`);
      
      router.push({
        pathname: "/roster/[playerSlug]" as any,
        params: { playerSlug }
      });
      
      return false; // Prevent default handling
    } else {
      console.log('Failed to extract player slug from URL:', url);
    }
  }
  
  // For external links, open in browser
  console.log('Opening external link in browser:', url);
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.error("Can't open URL:", url);
      Alert.alert("Error", "Can't open this URL: " + url);
    }
  });
  return false; // Prevent default handling
};

// Custom styling for article content
const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textSecondary,
    padding: 12,
  },
  paragraph: {
    marginVertical: 12,
    lineHeight: 24,
  },
  strong: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  link: {
    color: Colors.techGold,
    textDecorationLine: 'underline',
  },
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.techMediumGold,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 6,
  },
});

const Articles = ({ selectedArticle }: { selectedArticle: Article }) => {
  const searchParams = useLocalSearchParams();
  const title = searchParams.title || '';
  const date = searchParams.date || '';
  const imageUrl = searchParams.imageUrl || '';
  const imageAuthor = searchParams.imageAuthor || '';
  const contentUrl = searchParams.contentUrl || '';
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  // Fetch content for the selected article
  const fetchContent = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching article content from URL:', contentUrl);
      
      if (typeof contentUrl === 'string') {
        // Try to get the cleaned content using our existing fetchArticleContent helper
        const cleanedContent = await fetchArticleContent(contentUrl);
        
        if (cleanedContent && cleanedContent.trim().length > 0) {
          console.log('Got cleaned content, length:', cleanedContent.length);
          console.log('Content has paragraph breaks:', cleanedContent.includes('\n\n'));
          
          // Count paragraphs for debugging
          const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim().length > 0);
          setDebugInfo(`Paragraphs: ${paragraphs.length}`);
          
          setMarkdownContent(cleanedContent);
        } else {
          // Fallback message if content is empty
          console.log('Got empty content, using fallback');
          setMarkdownContent(`Georgia Tech Lacrosse welcomes ${title}! More details coming soon.`);
        }
      }
    } catch (error) {
      console.error('Error fetching article content:', error);
      setMarkdownContent('Unable to load article content. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [contentUrl]);
  
  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: Array.isArray(imageUrl) ? imageUrl[0] : imageUrl }}
        style={styles.detailImage}
        contentFit="cover"
        transition={200}
        placeholder={blurhash}
        cachePolicy="memory-disk"
      />
      <Text style={styles.imageAuthor}>Photo by: {imageAuthor}</Text>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailDate}>{date}</Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.loadingWheel} style={{marginVertical: 20}} />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      ) : (
        <View>
          <Markdown 
            style={markdownStyles}
            onLinkPress={handleLinkPress}
          >
            {markdownContent}
          </Markdown>
        </View>
      )}
      
      <Text style={{ marginBottom: 20 }}></Text>
    </ScrollView>
  );
}

export default Articles;
