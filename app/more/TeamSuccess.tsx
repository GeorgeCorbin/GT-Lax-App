import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Colors from '@/constants/Colors';
import FitImage from 'react-native-fit-image';
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
- 2019
- 2018
- 2017
- 2016
- 2015
- 2004

**No tournaments were held in 2020 or 2021 due to Covid*
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
          marginBottom: 8,
          fontFamily: 'Roboto-regular-Bold',
        },
        heading3: {
          fontSize: 20,
          fontWeight: 'bold',
          color: Colors.techMediumGold,
          marginBottom: 8,
          fontFamily: 'Roboto-regular-Bold',
        },
        paragraph: {
          marginBottom: 12,
          fontSize: 13,
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
