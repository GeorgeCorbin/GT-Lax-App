import { StyleSheet } from 'react-native';
import Colors from "../Colors";

export const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f4f4f4',
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      },
      cartContainer: {
        marginBottom: 16,
      },
      cartTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      },
      cartList: {
        paddingBottom: 16,
      },
      cartItem: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: Colors.diploma,
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center',
        borderColor: Colors.grayMatter,
        borderWidth: 1,
      },
      cartItemImage: {
        width: 80,
        height: 80,
        marginLeft: 8,
      },
      cartItemDetails: {
        flex: 1,
        padding: 8,
      },
      cartItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      },
      cartItemPrice: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      },
      cartItemDetailsText: {
        fontSize: 14,
        color: '#666',
      },
      cartItemQuantity: {
        fontSize: 14,
        color: '#666',
      },
      quantityInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
      },
      quantityButton: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: Colors.buttonPrimary.background,
        alignItems: 'center',
        marginHorizontal: 8,
      },
      quantityButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      },
      quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      },
      totalCost: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 16,
        color: '#333',
        fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      },
      removeButton: {
        padding: 8,
        backgroundColor: '#FF6347',
        borderRadius: 4,
        marginLeft: 8,
        marginRight: 8,
      },
      removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      },
      inputGroup: {
        marginBottom: 16,
      },
      label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      },
      input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      },
      rowGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      halfWidth: {
        flex: 1,
        marginRight: 8,
      },
      cardSection: {
        marginBottom: 16,
      },
      cardContainer: {
        height: 50,
        marginBottom: 16,
      },
      card: {
        backgroundColor: '#fff',
      },
      orderButton: {
        // backgroundColor: '#007BFF',
        backgroundColor: Colors.buttonPrimary.background,
        paddingVertical: 16,
        borderRadius: 4,
        marginTop: 16,
        marginBottom: 32,
      },
      orderButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: 'Roboto-Regular-bold', // Apply Roboto-Regular font
      },
      emptyCartText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
      },
      formContainer: {
        marginBottom: 16,
      },
    });
  