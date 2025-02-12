import Colors from '@/constants/Colors';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';


const LeagueInfo = () => {
  const [markdownData, setMarkdownData] = useState<string>('');
  
  useEffect(() => {
    const fetchMarkdownData = async () => {
      try {
        const response = await axios.get('https://gt-lax-app.web.app/about/LeagueInfoText.md');
        setMarkdownData(response.data);
      } catch (error) {
        console.error('Error fetching Team Success data:', error);
      }
    };
    fetchMarkdownData();
  }, []);
  
  const markdownContent = markdownData;

  return (
    <AnimatedHeaderLayout headerText="About MCLA & SELC" backgroundColor={Colors.background}>
      <Markdown style={{
        bold: {
          fontSize: 28,
          fontWeight: 'bold',
          color: Colors.textPrimary,
          marginBottom: 10,
          fontFamily: 'Roboto-regular-Bold',
        },
        body: {
          fontSize: 18,
          lineHeight: 24,
          color: Colors.textSecondary,
          padding: 12,
          fontFamily: 'Roboto-regular',
        },
        heading1: {
          fontSize: 28,
          fontWeight: 'bold',
          color: Colors.textPrimary,
          marginBottom: 10,
          fontFamily: 'Roboto-regular-Bold',
        },
        heading2: {
          fontSize: 24,
          fontWeight: 'bold',
          color: Colors.textPrimary,
          marginTop: 16,
          marginBottom: 8,
          fontFamily: 'Roboto-regular-Bold',
        },
        heading3: {
          fontSize: 20,
          fontWeight: 'bold',
          color: Colors.techMediumGold,
          marginTop: 16,
          marginBottom: 8,
          fontFamily: 'Roboto-regular-Bold',
        },
        heading4: {
          fontSize: 18,
          color: Colors.textSecondary,
          marginTop: 8,
          fontFamily: 'Roboto-regular-Bold',
        },
        paragraph: {
          marginBottom: 16,
          fontSize: 18,
          fontFamily: 'Roboto-Regular',
        },
        link: {
          color: '#007bff',
          textDecorationLine: 'underline', // This will still work but without strict typing.
        },
        listItem: {
          fontSize: 16,
          marginBottom: 6,
          fontFamily: 'Roboto-regular',
        },
      }}>
      {markdownContent}
      </Markdown>
      <View style={{ marginBottom: 70 }} />
    </AnimatedHeaderLayout>
  );
};

export default LeagueInfo;