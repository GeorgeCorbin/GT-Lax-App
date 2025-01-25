import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native';
import styles from '../../constants/styles/news'; // Updated path for styles
import { Link } from 'expo-router';
import { useAppData } from '@/context/AppDataProvider';
import Colors from '@/constants/Colors';

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
  const { articles, loading, fetchArticles } = useAppData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('onRefresh called');
    setRefreshing(true);
    try {
      await Promise.all([
        fetchArticles(true), // Force refresh
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
    } catch (error) {
      console.error('Error refreshing articles:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchArticles]); 
  
  useEffect(() => {
    const fetchOnMount = async () => {
      await fetchArticles(); // Default: respect server cache
    };
  
    fetchOnMount();
    console.log('News useEffect triggered for initial fetch');
  }, [fetchArticles]);
  

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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.loadingWheel} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>News</Text>
      <FlatList
        data={articles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        // refreshControl={
        // <RefreshControl
        //   refreshing={refreshing}
        //   onRefresh={onRefresh}
        //   colors={[Colors.loadingWheel]}
        // />
        // }
      />
    </View>
  );
};

export default NewsScreen;
