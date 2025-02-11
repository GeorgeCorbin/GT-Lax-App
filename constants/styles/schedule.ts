import { StyleSheet } from 'react-native';
import Colors from '../Colors';

const styles = StyleSheet.create({
  // General container for the screen
  container: {
    // backgroundColor: Colors.grayMatter, // Black background for the entire screen
    backgroundColor: Colors.background, // Black background for the entire screen
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
  headerText: {
    fontSize: 48,
    fontWeight: 'bold',
    // color: '#FFF', // White text for the header
    fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
    color: Colors.textTitle, // Black background for the header
  },
  recordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.techGold, // Updated gold for the record text
    fontFamily: 'roboto-regular-bold',
    textAlign: 'right', // Right-align the text
    flex: 1, // Take up the remaining space
  },

  // Section title (e.g., UPCOMING, COMPLETED)
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.techGold, // Updated gold
    marginVertical: 12,
    fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
    // shadowColor: Colors.grayMatter, // Shadow color
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.4,
    // shadowRadius: 3.84,
    // shadowRadius: 6,
    shadowColor: Colors.grayMatter,
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },

  // Game item card
  gameItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    position: 'relative',
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
    // shadowColor: '#fff',
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: .7,
    // shadowRadius: 1,
  },

  // Date and time section
  detailsRow: {
    flexDirection: 'column',
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
    fontFamily: 'roboto-regular-bold',
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
    backgroundColor: Colors.background, // Black background
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
    fontFamily: 'roboto-regular-bold',
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
    fontFamily: 'roboto-regular-bold',
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
  dropdown: {
    minWidth: 120, // Set a minimum width
    backgroundColor: Colors.buttonPrimary.background, // Match color scheme
    borderRadius: 4, // Rounded corners
    alignSelf: 'flex-end', // Align dropdown to the right
    zIndex: 1000, // Ensure it overlays content
    top: 50, // Adjust as needed
    position: 'absolute', // Position the dropdown
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0, 
  },
  dropdownText: {
    fontSize: 14, // Set the font size
    color: Colors.buttonPrimary.text,
    textAlign: 'center', // Center-align text
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular-bold',
  },
  dropdownItemText: {
    fontSize: 14, // Comfortable text size
    color: Colors.buttonPrimary.text, // Text contrast
    textAlign: 'center', // Center-align for dropdown text
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular-bold',
    backgroundColor: Colors.buttonPrimary.background, // Match dropdown background
  },
  dropRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Place items at opposite ends
    alignItems: 'center', // Vertically align items
    marginBottom: 16, // Add space between the dropdown and items below
  },
  dropdownContainer: {
    backgroundColor: Colors.buttonPrimary.background,
    borderColor: Colors.buttonPrimary.background,
    
  },
  dropdownItemTextHighlight: {
    color: Colors.buttonPrimary.text, // Highlight the selected item
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16, // Add space between the dropdown and items below
  },
});

export default styles;
