import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Markdown from 'react-native-markdown-display';
import Colors from '@/constants/Colors';
import FitImage from 'react-native-fit-image';
import styles from '../../constants/styles/news'; // Updated path for styles
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';

const markdownContent = `
## Team Success

##

### SELC Conference Championships:

- 2024
- 2023
- 2017
- 2016
- 2004
- 1997

##

### MCLA National Tournament Appearances:

- 2024
- 2023
- 2022 (Runner-up)
- No Tournament 2021 (Covid)
- No Tournament 2020 (Covid)
- 2019
- 2018
- 2017
- 2016
- 2015
- 2004
`;

const TeamSuccess: React.FC = () => {
  return (
    <AnimatedHeaderLayout headerText="Team Success" backgroundColor={Colors.background}>
      <Markdown style={{
        bold: {
          fontSize: 28,
          fontWeight: 'bold',
          color: Colors.textPrimary,
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
      rules={{
        image: (node, children, parent, styles) => {
          const key = node.key || `${(node as any).target}-${Math.random()}`;
          return (
            <FitImage
              key={key}
              style={styles.image}
              source={{ uri: (node as any).target }}
              accessible
              accessibilityLabel={(node as any).alt}
            />
          );
        },
      }}>
      {markdownContent}</Markdown>
      <View style={{ marginBottom: 70 }} />
    </AnimatedHeaderLayout>
  );
};

export default TeamSuccess;
