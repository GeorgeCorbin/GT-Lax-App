import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Link } from 'expo-router';
import styles from '@/constants/styles/roster';
import Markdown from 'react-native-markdown-display';
import Colors from '@/constants/Colors'; // Ensure this path is correct
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import { useSearchParams } from 'expo-router/build/hooks';

type Player = {
    id: number;
    playerName: string;
    position: string;
    number: number;
    imageUrl: string;
    contentUrl: string;
  };

const PlayerBio = ({ selectedPlayer }: { selectedPlayer: Player }) => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';
  const number = searchParams.get('number') || '';
  const position = searchParams.get('position') || '';
  const imageUrl = searchParams.get('imageUrl') || '';
  const contentUrl = searchParams.get('contentUrl') || '';
  const [markdownContent, setMarkdownContent] = useState('');
//   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);


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

  return (
    <AnimatedHeaderLayout headerText={name} recordText={`#${number}`} backgroundColor={styles.container.backgroundColor}>
      <Image source={{ uri: imageUrl }} style={styles.detailImage} />
      <Text style={styles.detailName}>{name}</Text>
      <Text style={styles.detailPosition}>{position}</Text>
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
      {/* <Link href="/roster" style={styles.bottombackButton}>
        <Text style={styles.backButtonText}>Back to the Roster</Text>
      </Link> */}
      <Text style={{ marginBottom: 20 }}></Text>
    </AnimatedHeaderLayout>
  );
};

export default PlayerBio;
