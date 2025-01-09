import { StyleSheet } from 'react-native';
import Colors from '../Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 0,
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
      textAlign: 'left',
      color: Colors.textTitle,
      fontFamily: 'roboto-regular-bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: 'roboto-regular-bold',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3.84,
  },
  playerContainerBox: {
    marginHorizontal: 10,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: 145, // needs to be same as playerContainer width for centering (All because of Link)
  },
  playerContainer: {
    alignItems: 'center',
    width: 145, // needs to be same as playerContainerBox width for centering (All because of Link)
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
    fontFamily: 'roboto-regular-bold',
  },
  playerNumber: {
    fontSize: 12,
    color: '#ccc',
  },
  detailImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    fontFamily: 'roboto-regular',
    borderRadius: 15,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
    fontFamily: 'roboto-regular-bold',
  },
  detailPosition: {
    fontSize: 20,
    color: '#dac368',
    textAlign: 'center',
    fontFamily: 'roboto-regular',
  },
  detailNumber: {
    fontSize: 18,
    color: '#dac368',
    textAlign: 'center',
    fontFamily: 'roboto-regular',
  },
  bottombackButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.buttonPrimary.background,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 40,
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
    // marginBottom: 20,
  },
  topBackButtonText: {
    color: Colors.buttonPrimary.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'roboto-regular-bold',
  },
  listViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.navyBlue,
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    // flex: 1,
  },
  columnHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.techGold,
    fontFamily: 'roboto-regular-bold',
    // flex: 1, // Ensures equal space for each column
    // textAlign: 'center', // Centers the text horizontally
    // flex: auto,
    // color: Colors.techGold,
  },
  listViewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    // backgroundColor: Colors.navyBlue,
  },
  listViewText: {
    fontSize: 16,
    // flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontFamily: 'roboto-regular',
    // paddingHorizontal: 8, // Adds spacing between columns
  },
  listViewColumnNumber: {
    flex: 1, // Adjust column width
    textAlign: 'center',
  },
  listViewColumnName: {
    flex: 2, // Adjust column width
    textAlign: 'center',
  },
  listViewColumnPosition: {
    flex: 2, // Adjust column width
    textAlign: 'center',
  },
  listViewColumnYear: {
    flex: 1,
    textAlign: 'center',
    // paddingHorizontal: 12,
  },
  switchContainer: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 10,
  },
});

export default styles;
