import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playerContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  playerName: {
    marginTop: 8,
    fontSize: 16,
  },
  bioImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  bioName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bioDetails: {
    fontSize: 18,
    marginVertical: 4,
  },
});
