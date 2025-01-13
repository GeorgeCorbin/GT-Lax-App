import { StyleSheet } from 'react-native';
import Colors from "../Colors";

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: Colors.background, // Dark blue background
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    headerText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: Colors.textTitle,
      fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
    },
    section: {
      marginBottom: 20,
    },
    sectionHeader: {
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors.textPrimary, // Gold text
      marginBottom: 10,
      fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      shadowColor: Colors.grayMatter,
      shadowOffset: { width: 3, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3.84,
    },
    link: {
      fontSize: 24,
      color: Colors.textSecondary,
      paddingVertical: 5,
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    finePrintContainer: {
      marginTop: 20,
      marginBottom: 20,
    },
    finePrint: {
      fontSize: 12,
      textAlign: 'center',
      color: Colors.gray,
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
  });

export default styles;