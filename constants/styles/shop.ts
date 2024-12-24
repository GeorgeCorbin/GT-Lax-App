import { StyleSheet } from 'react-native';
import Colors from "../Colors";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.navyBlue, // Navy blue background
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',    
    },
    title: {
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors.white, // White text
      marginBottom: 40,
    },
    messageContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    soldOutMessage: {
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.white, // White text
      marginBottom: 10,
    },
    subMessage: {
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      fontSize: 16,
      color: Colors.piMile, // Light gray text
      textAlign: 'center',
    },
    refreshButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: Colors.techGold, // Gold color for button
      borderRadius: 5,
    },
    refreshText: {
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000000', // Black text
    },
  });

  export default styles;