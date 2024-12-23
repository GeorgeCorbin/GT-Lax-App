import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

const defaultHeadshot = require('/Users/georgecorbin/GT-Lax-App/assets/images/rosterPictures/headshot_default.png'); // Updated path for default headshot

type BioPageRouteProp = RouteProp<{ params: { player: { name: string; number: string; year: string; position: string; image?: string } } }, 'params'>;

const BioPage = ({ route }: { route: BioPageRouteProp }) => {
  const { player } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={defaultHeadshot} // Replace with player.image if available
        style={styles.bioImage}
      />
      <Text style={styles.bioName}>{player.name}</Text>
      <Text style={styles.bioDetails}>Number: {player.number}</Text>
      <Text style={styles.bioDetails}>Year: {player.year}</Text>
      <Text style={styles.bioDetails}>Position: {player.position}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
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
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
  bioDetails: {
    fontSize: 18,
    marginVertical: 4,
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
});

export default BioPage;
