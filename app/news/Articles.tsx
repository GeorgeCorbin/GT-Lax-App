import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import Colors from '@/constants/Colors'; // Ensure this path is correct
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import styles from '../../constants/styles/news'; // Updated path for styles

interface Article {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  imageAuthor: string;
  contentUrl: string;
  contentAuthor?: string;
}

const Articles = ({ selectedArticle }: { selectedArticle: Article }) => {
  const searchParams = useLocalSearchParams();
  const title = searchParams.title || '';
  const date = searchParams.date || '';
  const imageUrl = searchParams.imageUrl || '';
  const imageAuthor = searchParams.imageAuthor || '';
  const contentUrl = searchParams.contentUrl || '';
  const [markdownContent, setMarkdownContent] = useState('');

  // Fetch Markdown content for the selected article
  const fetchMarkdownContent = async () => {
    try {
      if (typeof contentUrl === 'string') {
        const response = await fetch(contentUrl);
      const content = await response.text();
      setMarkdownContent(content);
    }
    } catch (error) {
      console.error('Error fetching markdown content:', error);
    }
  };

  useEffect(() => {
    fetchMarkdownContent();
  }, [contentUrl]);
  
  return (
    <ScrollView style={styles.container}>
      
      <Image source={{ uri: Array.isArray(imageUrl) ? imageUrl[0] : imageUrl }} style={styles.detailImage} />
      <Text style={styles.imageAuthor}>Photo by: {imageAuthor}</Text>
      {/* Top Back Button */}
      {/* <TouchableOpacity style={styles.topBackButton} onPress={() => setSelectedArticle(null)}>
        <Text style={styles.topBackButtonText}>← Back</Text>
      </TouchableOpacity> */}
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailDate}>{date}</Text>
      <Markdown style={{
        bold: {
          fontSize: 28,
          fontWeight: 'bold',
          color: Colors.techGold,
          marginBottom: 10,
        },
        body: {
          fontSize: 18,
          lineHeight: 24,
          color: Colors.diploma,
          padding: 12,
        },
        heading1: {
          fontSize: 28,
          fontWeight: 'bold',
          color: Colors.techGold,
          marginBottom: 10,
        },
        heading2: {
          fontSize: 24,
          fontWeight: 'bold',
          color: Colors.techGold,
          marginBottom: 8,
        },
        heading3: {
          fontSize: 20,
          fontWeight: 'bold',
          color: Colors.techMediumGold,
          marginBottom: 8,
        },
        paragraph: {
          marginBottom: 12,
        },
        link: {
          color: '#007bff',
          textDecorationLine: 'underline', // This will still work but without strict typing.
        },
        listItem: {
          fontSize: 16,
          marginBottom: 6,
        },
      }}>
      {markdownContent}</Markdown>
      {/* <TouchableOpacity style={styles.bottombackButton} onPress={() => setSelectedArticle(null)}>
        <Text style={styles.backButtonText}>Back to News</Text>
      </TouchableOpacity> */}
      <Text style={{ marginBottom: 20 }}></Text>
    </ScrollView>
  );
}

export default Articles;
