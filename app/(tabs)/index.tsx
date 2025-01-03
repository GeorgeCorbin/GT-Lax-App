import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import styles from '../../constants/styles/news'; // Updated path for styles
import ReactMarkdown from 'react-markdown';
import Colors from '@/constants/Colors';
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

  // const renderArticleItem = ({ item }: { item: Article }) => (
  //   <TouchableOpacity
  //     style={styles.card}
  //     onPress={() => {
  //       setSelectedArticle(item);
  //       fetchMarkdownContent(item.contentUrl); // Fetch the Markdown content
  //     }}
  //   >
  //     <Image source={{ uri: item.imageUrl }} style={styles.image} />
  //     <View style={styles.textContainer}>
  //       <Text style={styles.date}>{item.date}</Text>
  //       <Text style={styles.title}>{item.title}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

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

  // if (selectedArticle) {
  //   return (
  //     <ScrollView style={styles.container}>
        
  //       <Image source={{ uri: selectedArticle.imageUrl }} style={styles.detailImage} />
  //       <Text style={styles.imageAuthor}>Photo by: {selectedArticle.imageAuthor}</Text>
  //       {/* Top Back Button */}
  //       <TouchableOpacity style={styles.topBackButton} onPress={() => setSelectedArticle(null)}>
  //         <Text style={styles.topBackButtonText}>← Back</Text>
  //       </TouchableOpacity>
  //       <Text style={styles.detailTitle}>{selectedArticle.title}</Text>
  //       <Text style={styles.detailDate}>{selectedArticle.date}</Text>
  //       <Markdown style={{
  //         bold: {
  //           fontSize: 28,
  //           fontWeight: 'bold',
  //           color: Colors.techGold,
  //           marginBottom: 10,
  //         },
  //         body: {
  //           fontSize: 18,
  //           lineHeight: 24,
  //           color: Colors.diploma,
  //           padding: 12,
  //         },
  //         heading1: {
  //           fontSize: 28,
  //           fontWeight: 'bold',
  //           color: Colors.techGold,
  //           marginBottom: 10,
  //         },
  //         heading2: {
  //           fontSize: 24,
  //           fontWeight: 'bold',
  //           color: Colors.techGold,
  //           marginBottom: 8,
  //         },
  //         heading3: {
  //           fontSize: 20,
  //           fontWeight: 'bold',
  //           color: Colors.techDarkGold,
  //           marginBottom: 8,
  //         },
  //         paragraph: {
  //           marginBottom: 12,
  //         },
  //         link: {
  //           color: '#007bff',
  //           textDecorationLine: 'underline', // This will still work but without strict typing.
  //         },
  //         listItem: {
  //           fontSize: 16,
  //           marginBottom: 6,
  //         },
  //       }}>
  //       {markdownContent}</Markdown>
  //       <TouchableOpacity style={styles.bottombackButton} onPress={() => setSelectedArticle(null)}>
  //         <Text style={styles.backButtonText}>Back to News</Text>
  //       </TouchableOpacity>
  //     </ScrollView>
  //   );
  // }

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
