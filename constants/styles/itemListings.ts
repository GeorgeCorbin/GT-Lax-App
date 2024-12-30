import { StyleSheet } from 'react-native';
import Colors from '../Colors';

export const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#f4f4f4',
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
      color: '#333',
      marginBottom: 8,
    },
    itemPrice: {
      fontSize: 20,
      color: '#666',
      marginBottom: 16,
    },
    sectionContainer: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
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
      backgroundColor: '#007BFF',
    },
    optionText: {
      fontSize: 16,
      color: '#333',
    },
    selectedOptionText: {
      color: '#fff',
    },
    addButton: {
      backgroundColor: '#007BFF',
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
    },
    itemDescription: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
      marginTop: 16,
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
    },
  });