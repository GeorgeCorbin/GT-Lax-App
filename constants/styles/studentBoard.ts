import { StyleSheet } from 'react-native';
import Colors from '../Colors';

export const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.background
    },
    title: {
      fontSize: 42,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 24,
      color: Colors.textTitle,
      fontFamily: 'roboto-regular-bold',
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    photoContainer: {
      alignItems: 'flex-start',
      flexDirection: 'column',
      marginRight: 16,
      maxWidth: 140, // Adjust the value based on your layout

    },
    position: {
      marginBottom: 8,
      textAlign: 'left',
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.textPrimary,
      fontFamily: 'roboto-regular-bold',
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 3.84,
    },
    photo: {
      width: 120,
      height: 120,
      borderRadius: 15,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      color: Colors.textPrimary,
      fontFamily: 'roboto-regular-bold',
    },
    bio: {
      fontSize: 14,
      color: Colors.textSecondary,
      fontFamily: 'roboto-regular',
    },
  });