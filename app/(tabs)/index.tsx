import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../../constants/styles/news'; // Updated path for styles
import { Link } from 'expo-router';

interface Article {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
  imageAuthor: string;
  contentUrl: string;
  contentAuthor?: string;
}

const NewsScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  // const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  // const [markdownContent, setMarkdownContent] = useState('');

  // Fetch articles from the hosted JSON file or API
  const fetchArticles = async () => {
    try {
      const response = await fetch('https://gt-lax-app.web.app/articles.json'); // Replace with your actual API or JSON URL
      const data = await response.json();
      setArticles(data.reverse());
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Markdown content for the selected article
  // const fetchMarkdownContent = async (url: string) => {
  //   try {
  //     const response = await fetch(url);
  //     const content = await response.text();
  //     setMarkdownContent(content);
  //   } catch (error) {
  //     console.error('Error fetching markdown content:', error);
  //   }
  // };

  useEffect(() => {
    fetchArticles();
  }, []);

  const renderArticleItem = ({ item }: { item: Article }) => (
    <Link
      href={{
        pathname: '/news/Articles',
        params: {
          id: item.id,
          title: item.title,
          date: item.date,
          imageUrl: item.imageUrl,
          imageAuthor: item.imageAuthor,
          contentUrl: item.contentUrl,
        },
      }}
      style={styles.card}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </Link>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>News</Text>
      <FlatList
        data={articles}
        renderItem={renderArticleItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default NewsScreen;
