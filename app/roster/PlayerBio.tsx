import React, { useState, useEffect } from 'react';
import { Text, Image } from 'react-native';
import styles from '@/constants/styles/roster';
import Markdown from 'react-native-markdown-display';
import Colors from '@/constants/Colors'; // Ensure this path is correct
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import { useLocalSearchParams } from 'expo-router/build/hooks';

type Player = {
    id: number;
    playerName: string;
    position: string;
    number: number;
    imageUrl: string;
    contentUrl: string;
  };

const PlayerBio = ({ selectedPlayer }: { selectedPlayer: Player }) => {
  const searchParams = useLocalSearchParams();
  const name = Array.isArray(searchParams.name) ? searchParams.name[0] : searchParams.name || '';
  const number = Array.isArray(searchParams.number) ? searchParams.number[0] : searchParams.number || '';
  const position = Array.isArray(searchParams.position) ? searchParams.position[0] : searchParams.position || '';
  const imageUrl = Array.isArray(searchParams.imageUrl) ? searchParams.imageUrl[0] : searchParams.imageUrl || '';
  const contentUrl = Array.isArray(searchParams.contentUrl) ? searchParams.contentUrl[0] : searchParams.contentUrl || '';
  const [markdownContent, setMarkdownContent] = useState('');

  // Fetch markdown content for the selected player
  const fetchMarkdownContent = async () => {
    try {
      const response = await fetch(contentUrl);
      const content = await response.text();
      setMarkdownContent(content);
    } catch (error) {
      console.error('Error fetching markdown content:', error);
    }
  };

  useEffect(() => {
    fetchMarkdownContent();
  }, [contentUrl]);

  /* 
        const groupedRoster = {
        Defense: roster.filter((p) => ['D', 'LSM'].includes(p.position)),
        Attack: roster.filter((p) => p.position === 'A'),
        Middies: roster.filter((p) => p.position === 'M'),
        Goalies: roster.filter((p) => p.position === 'G'),
        'Face-Off': roster.filter((p) => p.position === 'FO'),
  */

  return (
    <AnimatedHeaderLayout headerText={name} recordText={`#${number}`} backgroundColor={styles.container.backgroundColor}>
      <Image source={{ uri: imageUrl }} style={styles.detailImage} />
      <Text style={styles.detailName}>{name}</Text>
      <Text style={styles.detailPosition}>
        {position === 'D' || position === 'LSM' ? 'Defense' : 
         position === 'A' ? 'Attack' : 
         position === 'M' ? 'Middie' : 
         position === 'G' ? 'Goalie' : 
         position === 'FO' ? 'Face-Off' : position}
        </Text>
      <Text style={styles.detailNumber}>#{number}</Text>
      <Markdown
        style={{
          bold: {
            fontSize: 28,
            fontWeight: 'bold',
            color: Colors.techGold,
            marginBottom: 10,
          },
          body: {
            fontSize: 18,
            lineHeight: 24,
            color: Colors.textSecondary,
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
            color: Colors.techDarkGold,
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
        }}
      >
        {markdownContent}
      </Markdown>
      <Text style={{ marginBottom: 20 }}></Text>
    </AnimatedHeaderLayout>
  );
};

export default PlayerBio;
