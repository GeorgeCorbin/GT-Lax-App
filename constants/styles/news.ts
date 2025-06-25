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
    marginHorizontal: 8,
    marginBottom: 20,
    // overflow: 'hidden',

    // Elevation for Android
    elevation: 5,
    
    // Shadow for iOS
    shadowColor: Colors.grayMatter,
    shadowOffset: { width: 3, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 10,
    shadowColor: Colors.grayMatter,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  date: {
    fontSize: 12,
    fontFamily: 'roboto-regular',
    color: Colors.diploma,
    marginBottom: 5,
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 1,
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    textShadowColor: Colors.grayMatter,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'roboto-bold',
    color: Colors.diploma,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowColor: Colors.grayMatter,

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
    color: Colors.textPrimary,
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
  loadingContainer: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background, // Black background
  },
  loadingText: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textSecondary,
    padding: 16,
    marginTop: 8,
    fontFamily: 'roboto-regular',
  },
  contentText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
    padding: 16,
    marginTop: 8,
    fontFamily: 'System',
  },
});

