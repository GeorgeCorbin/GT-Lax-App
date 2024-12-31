import { StyleSheet } from 'react-native';
import Colors from "../Colors";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.textTitle,
    textAlign: 'left',
    fontFamily: 'roboto-regular-bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'roboto-regular-bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
    fontFamily: 'roboto-regular',
  },
  buyButton: {
    backgroundColor: Colors.buttonPrimary.background,
    paddingVertical: 8,
    borderRadius: 4,
    textAlign: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'roboto-regular-bold',
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
    fontFamily: 'roboto-regular',
  },
  cartContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
  },
  cartButton: {
    padding: 8,
    borderColor: '#fff',
  },
  cartIcon: {
    width: 24,
    height: 24,
  },
});

  export default styles;