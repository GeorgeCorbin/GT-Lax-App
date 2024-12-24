import { StyleSheet } from 'react-native';
import Colors from "../Colors";

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: Colors.navyBlue, // Dark blue background
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#ffffff',
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    section: {
      marginBottom: 20,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.techGold, // Gold text
      marginBottom: 10,
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    link: {
      fontSize: 16,
      color: Colors.diploma, // Light gray text
      paddingVertical: 5,
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
  });

export default styles;