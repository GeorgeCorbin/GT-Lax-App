import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
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
  const { articles, loading } = useAppData();

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
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default NewsScreen;
