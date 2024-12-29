import { StyleSheet } from 'react-native';
import Colors from '../Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f3553',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  headerContainer: {
    // backgroundColor: '#3b4564',
    // paddingVertical: 30,
    // alignItems: 'center',
    // marginBottom: 20,
    // borderBottomWidth: 2,
    // borderBottomColor: '#dac368',
  },
  headerText: {
      fontSize: 48,
      fontWeight: 'bold',
      marginLeft: 10,
      marginBottom: 20,
      textAlign: 'left',
      color: Colors.textTitle,
      fontFamily: 'roboto-regular',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dac368',
    marginBottom: 10,
    marginLeft: 10,
  },
  playerContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#3b4564',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  playerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerNumber: {
    fontSize: 12,
    color: '#ccc',
  },
  detailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
  },
  detailPosition: {
    fontSize: 20,
    color: '#dac368',
    textAlign: 'center',
  },
  detailNumber: {
    fontSize: 18,
    color: '#dac368',
    textAlign: 'center',
  },
  // backButton: {
  //   marginTop: 20,
  //   alignItems: 'center',
  //   backgroundColor: Colors.buttonPrimary.background,
  // },
  // backButtonText: {
  //   fontSize: 18,
  //   color: Colors.buttonPrimary.text,
  // },
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
  },
  topBackButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    backgroundColor: Colors.buttonPrimary.background,
    borderRadius: 5,
    marginBottom: 20,
  },
  topBackButtonText: {
    color: Colors.buttonPrimary.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
