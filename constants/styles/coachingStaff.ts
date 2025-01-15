import { StyleSheet } from 'react-native';
import Colors from '../Colors';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items at the top of the row
    marginTop: 8,
  },
  photoContainer: {
    marginRight: 16,
    alignItems: 'center',
    maxWidth: 120,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    wordWrap: 'break-word',
  },
  bioContainer: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.textPrimary,
    fontFamily: 'roboto-regular-bold',
  },
  position: {
    marginBottom: 4,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: 'roboto-regular-bold',
    // shadowColor: Colors.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.6,
    // shadowRadius: 3.84,
    shadowColor: Colors.grayMatter,
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    maxWidth: 200,
  },
  bio: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textSecondary,
    fontFamily: 'roboto-regular',
  },
});