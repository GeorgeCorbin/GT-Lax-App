import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Colors from '@/constants/Colors';
import FitImage from 'react-native-fit-image';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';

const markdownContent = `
## Georgia Tech is About Accomplishment

Lacrosse at Georgia Tech is about playing in a top program with a goal to win Championships while obtaining an outstanding innovative education in Engineering, Sciences or Business!

Lacrosse at Georgia Tech is a nationally competitive Club Sport dedicated to winning national championships and molding teamwork life skills.  Georgia Tech is a member of the [SouthEastern Lacrosse Conference (SELC)](https://mcla.us/conferences/selc) of the [Men's Collegiate Lacrosse Association (MCLA)](http://mcla.us/). We play a national schedule.

We are about winning as a TEAM! Building a Great Future. We have Big Goals! Understand what Georgia Tech Lacrosse is about from Players, Coaches and Alumni by following the 2016 Team as they pursued their dream as [documented in the "Big Goals" Series](https://youtu.be/FmN6mxk6fWs)

Lacrosse at Georgia Tech is about UpHolding The Ramblin Wreck and Helluva an Engineer Tradition!
`;

const TeamHistory: React.FC = () => {
  // const [teamHistoryContent, setTeamHistoryContent] = useState<string>('');

  // useEffect(() => {
  //   const loadMarkdown = async () => {
  //     try {
  //       const response = await fetch('https://gt-lax-app.web.app/about/TeamHistoryText.md');
  //       const content = await response.text();
  //       setTeamHistoryContent(content);
  //     } catch (error) {
  //       console.error('Error loading markdown file:', error);
  //     }
  //   };

  //   loadMarkdown();
  // }, []);

  return (
    <AnimatedHeaderLayout headerText="Georgia Tech Lacrosse" backgroundColor={Colors.background}>
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

export default TeamHistory;
