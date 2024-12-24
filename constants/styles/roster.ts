import { StyleSheet } from 'react-native';
import Colors from '../Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navyBlue, // Use centralized color
    padding: 16,
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.techGold, // Use centralized color
    marginBottom: 10,
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
  playerContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 16,
    color: Colors.white, // Use centralized color
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
});

export default styles;
