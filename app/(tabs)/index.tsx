import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import styles from '../../constants/styles/news';
import { Link } from 'expo-router';
import { useAppData } from '@/context/AppDataProvider';
import Colors from '@/constants/Colors';
import localFeatureFlags from '@/local_feature_flags';

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

  // Debug logging for articles
  useEffect(() => {
    if (articles.length > 0) {
      if (localFeatureFlags.disable_article_logs.enabled) {
        console.log('Articles loaded:', articles.length);
        console.log('First article:', JSON.stringify(articles[0], null, 2));
      }
      articles.forEach((article, index) => {
        if (localFeatureFlags.disable_article_logs.enabled) {
          console.log(`Article ${index} image URL:`, article.imageUrl);
        }
        // Test if the image URL is valid
        Image.prefetch(article.imageUrl)
          .then(() => {
            if (localFeatureFlags.disable_article_logs.enabled) {
              console.log(`Image prefetch success for article ${index}`);
            }
          })
          .catch(err => {
            if (localFeatureFlags.disable_article_logs.enabled) {
              console.error(`Image prefetch failed for article ${index}:`, err);
            }
          });
      });
    }
  }, [articles]);

  const renderArticleItem = ({ item }: { item: Article }) => {
    if (localFeatureFlags.disable_article_logs.enabled) {
      console.log('Rendering article:', item.id, 'with image URL:', item.imageUrl);
    }
    return (
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
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          placeholder={blurhash}
          cachePolicy="memory-disk"
          onLoad={() => {
            if (localFeatureFlags.disable_article_logs.enabled) {
              console.log('Image loaded successfully:', item.id);
            }
          }}
          onError={(error) => {
            if (localFeatureFlags.disable_article_logs.enabled) {
              console.error('Image load error:', item.id, error);
            }
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </Link>
    );
  };

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.loadingWheel]}
          />
        }
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
};

export default NewsScreen;
