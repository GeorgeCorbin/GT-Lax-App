import Colors from '@/constants/Colors';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';

const markdownContent = `
## About the MCLA

The [Men's Collegiate Lacrosse Association (MCLA)](https://mcla.us/) consists of nine non-varsity college lacrosse conferences featuring over 183 teams across 42 states and two countries. The association provides a governing structure similar to the NCAA, consisting of eligibility rules, national awards, polls, and championship tournaments.

## About the SELC

The Divison 1 [SouthEastern Lacrosse Conference (SELC)](https://www.theselc.net/) is the conference that Georgia Tech Lacrosse is in. The Conference is formatted into two divisions, North and South. The Yellow Jackets have won the SELC conference 6 times (1997, 2004, 2016, 2017, 2023 and 2024).

#### SELC North Division:
- Georgia Tech
- Georgia
- Alabama
- South Carolina

#### SELC South Division:
- Univeristy of Florida
- University of Central Florida
- Flordia State
- South Florida
- Auburn

### The Conferences

- Atlantic Lacrosse Conference [(ALC)](https://mcla.us/conferences/alc)  
- Continental Lacrosse Conference [(CLC)](https://mcla.us/conferences/clc)  
- Lone Star Alliance [(LSA)](https://mcla.us/conferences/lsa)  
- Pacific Northwest Collegiate Lacrosse League [(PNCLL)](https://mcla.us/conferences/pncll)  
- Rocky Mountain Lacrosse Conference [(RMLC)](https://mcla.us/conferences/rmlc)  
- SouthEastern Lacrosse Conference [(SELC)](https://mcla.us/conferences/selc)  
- Southwestern Lacrosse Conference [(SLC)](https://mcla.us/conferences/slc)  
- Upper Midwest Lacrosse Conference [(UMLC)](https://mcla.us/conferences/umlc)  
- Western Collegiate Lacrosse League [(WCLL)](https://mcla.us/conferences/wcll)
`;

const LeagueInfo = () => {
  // const [leagueInfoContent, setLeagueInfoContent] = useState<string>('');

  // useEffect(() => {
  //   const loadMarkdown = async () => {
  //     try {
  //       const response = await fetch('https://gt-lax-app.web.app/about/LeagueInfoText.md');
  //       const content = await response.text();
  //       setLeagueInfoContent(content);
  //     } catch (error) {
  //       console.error('Error loading markdown file:', error);
  //     }
  //   };

  //   loadMarkdown();
  // }, []);

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