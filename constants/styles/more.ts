import { StyleSheet } from 'react-native';
import Colors from "../Colors";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  section: {
    marginTop: 30,
    // marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayMatter,
    backgroundColor: Colors.background,
  },
  rowText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  arrowIcon: {
    fontSize: 18,
    color: Colors.gray,
  },
  finePrintContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  finePrint: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.gray,
  },
});

export default styles;
