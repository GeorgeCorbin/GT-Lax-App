import { StyleSheet } from 'react-native';
import Colors from "../Colors";
import { shadow } from 'react-native-paper';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 48,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: Colors.textTitle,
    fontFamily: 'roboto-regular-bold',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.techGold,
    borderRadius: 10,
    marginBottom: 20,
    // overflow: 'hidden',

    // Elevation for Android
    elevation: 5,
    
    // Shadow for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  date: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.diploma,
    marginBottom: 5,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'roboto-bold',
    color: Colors.diploma,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  detailImage: {
    width: '100%',
    height: 250,
    borderRadius: 5,
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: Colors.techGold,
    marginLeft: 8,
  },
  detailDate: {
    fontSize: 14,
    color: Colors.diploma,
    marginBottom: 20,
    textAlign: 'left',
    marginLeft: 9,
  },
  bottombackButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.buttonPrimary.background,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: Colors.buttonPrimary.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'roboto-regular-bold',
  },
  topBackButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    backgroundColor: Colors.buttonPrimary.background,
    borderRadius: 5,
    marginBottom: 10,
  },
  topBackButtonText: {
    color: Colors.buttonPrimary.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'roboto-regular-bold',
  },
  imageAuthor: {
    fontSize: 8,
    color: Colors.textSecondary,
    textAlign: 'left',
    marginLeft: 10,
    fontFamily: 'roboto-regular',
    marginBottom: 20,
  },
});

