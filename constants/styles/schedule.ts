import { StyleSheet } from 'react-native';
import Colors from '../Colors';

const styles = StyleSheet.create({
    // General container for the screen
    container: {
      backgroundColor: Colors.grayMatter, // Black background for the entire screen
      flex: 1,
      padding: 16,
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
  
    // Header section
    header: {
      flexDirection: 'row', // Align header items side by side
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      marginBottom: 16,
    },
    oldSeasonHeaderText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#FFF', // White text for the header
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    headerText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFF', // White text for the header
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    recordText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.techGold, // Updated gold for the record text
    },
  
    // Section title (e.g., UPCOMING, COMPLETED)
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.techGold, // Updated gold
      marginVertical: 12,
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
  
    // Game item card
    gameItem: {
      backgroundColor: Colors.navyBlue, // Updated navy background
      borderRadius: 8,
      marginBottom: 16,
      padding: 12,
      position: 'relative',
      // marginVertical: 10,
      // flexDirection: 'row',
      // justifyContent: 'space-between',
    },
  
    // Teams layout within a game card
    teamRow: {
      flexDirection: 'column', // Stack teams vertically
      marginBottom: 8,
    },
    teamColumn: {
      flexDirection: 'column', // Stack teams vertically
      flex: 2, // Allow room for the team section
    },
    team: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Space team name and score evenly
      marginBottom: 8,
    },  
    teamName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF', // White for team names
      flex: 2, // Take available space but leave room for the score
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    logo: {
      width: 32,
      height: 32,
      marginRight: 8,
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 2.5,
    },
  
    // Date and time section
    detailsRow: {
      flexDirection: 'column',
      // alignItems: 'flex-end', // Align items to the right
      justifyContent: 'center', // Center-align within the available space
      flex: 1, // Take up the remaining space
      // Centering result, date, location
      position: 'relative',
      alignItems: 'center',
    },
    date: {
      fontSize: 14,
      fontWeight: '500',
      color: Colors.white, // White text for dates
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      marginLeft: 8,
    },
    time: {
      fontSize: 14,
      fontWeight: '500',
      color: '#FFFFFF', // White text for times
      marginTop: 4,
    },
    location: {
      fontSize: 12, // Smaller font for location details
      color: '#FFFFFF', // White text for location
      marginTop: 4,
      fontFamily: 'Roboto-Regular-thin', // Apply Roboto-Regular font
      textAlign: 'center', // Right-align the text
      maxWidth: 100, // Limit the width of the location text
      marginLeft: 8,
    },
  
    // Loading screen
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000', // Black background
    },
    loadingText: {
      fontSize: 18,
      color: Colors.techGold, // Updated gold for loading text
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
  
    // Team Info (repeated in both teams)
    teamInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    // Row for organizing items horizontally
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  
    // Date and time alignment section
    dateTime: {
      flex: 1,
      alignItems: 'flex-end', // Align to the right
    },
  
    // Result, win, loss, and score styles
    result: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      marginLeft: 8,
      // Centering result, date, location
      textAlign: 'center',
    },
    win: {
      color: 'green', // Green for wins
      fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      textAlign: 'center', // Right-align the text      
    },
    loss: {
      color: 'red', // Red for losses
      fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      textAlign: 'center', // Right-align the text 
    },
    score: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.white, // White for scores
      fontFamily: 'Roboto-bold', // Apply Roboto-Regular font
      padding: 8,
    },
    divider: {
      width: 2, // Adjust width for visibility
      backgroundColor: Colors.white, // Divider color
      marginHorizontal: 10, // Space between columns
      height: '100%', // Ensure it spans the height of the container
      alignSelf: 'stretch', // Matches the height of the surrounding content
      opacity: 0.25, // Slightly transparent
      position: 'absolute', // Overlay the divider
      left: '64%', // Center the divider
    },    
  });

  export default styles;
  