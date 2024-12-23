import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../../constants/styles/roster';
// import defaultHeadshot from '/Users/georgecorbin/GT-Lax-App/assets/images/rosterPictures/headshot_default.png';

const defaultHeadshot = require('/Users/georgecorbin/GT-Lax-App/assets/images/rosterPictures/headshot_default.png'); // Updated path for default headshot

import { RouteProp } from '@react-navigation/native';

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

export default BioPage;
