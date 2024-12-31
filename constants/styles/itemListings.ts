import { StyleSheet } from 'react-native';
import Colors from '../Colors';

export const styles = StyleSheet.create({
    container: {
      padding: 16,
      // backgroundColor: '#f4f4f4',
      backgroundColor: Colors.background,
    },
    itemImage: {
      width: '100%',
      height: 250,
      borderRadius: 8,
      marginBottom: 16,
    },
    itemTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.textPrimary,
      marginBottom: 8,
      fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
    },
    itemPrice: {
      fontSize: 20,
      color: Colors.textSecondary,
      marginBottom: 16,
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    sectionContainer: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.textSecondary,
      marginBottom: 8,
      fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    optionButton: {
      borderWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
      marginRight: 8,
      marginBottom: 8,
    },
    selectedOptionButton: {
      // backgroundColor: '#007BFF',
      backgroundColor: Colors.buttonPrimary.background,
    },
    optionText: {
      fontSize: 16,
      color: Colors.textSecondary,
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    selectedOptionText: {
      fontWeight: 'bold',
      fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      color: Colors.textSecondary,
    },
    addButton: {
      backgroundColor: Colors.buttonPrimary.background,
      paddingVertical: 12,
      borderRadius: 4,
      marginTop: 16,
    },
    disabledButton: {
      backgroundColor: '#ccc',
    },
    addButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
    },
    itemDescription: {
      fontSize: 16,
      lineHeight: 24,
      marginTop: 16,
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f4f4',
    },
    loadingText: {
      marginTop: 8,
      fontSize: 16,
      color: '#666',
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f4f4',
    },
    errorText: {
      fontSize: 16,
      color: '#333',
      fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
    },
  });