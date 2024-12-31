import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../constants/styles/more';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import { Link } from 'expo-router';

const MoreScreen = () => {
  const navigation = useNavigation();

  return (
    <AnimatedHeaderLayout headerText="More" backgroundColor={styles.container.backgroundColor}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>More</Text>
      </View>
  
      {/* All Seasons Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionHeader}>All Seasons</Text>
        <Link href="/more/OldSeason?year=2023-24" style={styles.link}>
          2023-24 Season
        </Link>
        <Link href="/more/OldSeason?year=2022-23" style={styles.link}>
          2022-23 Season
        </Link>
        <Link href="/more/OldSeason?year=2021-22" style={styles.link}>
          2021-22 Season
        </Link>
      </View> */}

      {/* Front Office Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Front Office</Text>
        <Link href="/more/StudentBoard" style={styles.link}>
          Student Board
        </Link>
        <Link href="/more/CoachingStaff" style={styles.link}>
          Coaching Staff
        </Link>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Contact</Text>
        <TouchableOpacity onPress={() => {
          const email = 'gtlacrosse@gmail.com';
          const url = `mailto:${email}`;
          Linking.openURL(url).catch(err => console.error('Error opening email app:', err));
        }}>
          <Text style={styles.link}>Contact Team</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          const email = 'gcorbin36@gmail.com';
          const url = `mailto:${email}`;
          Linking.openURL(url).catch(err => console.error('Error opening email app:', err));
        }}>
          <Text style={styles.link}>Contact the Developer</Text>
        </TouchableOpacity>
      </View>

      {/* Social Media Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Social Media</Text>
        <TouchableOpacity onPress={() => Linking.openURL('www.gtlacrosse.com')}>
          <Text style={styles.link}>Visit our Website</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/gatechlax/')}>
          <Text style={styles.link}>Visit us on Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/GaTechLAX')}>
          <Text style={styles.link}>Visit us on Twitter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/GeorgiaTechMensLacrosse/')}>
          <Text style={styles.link}>Visit us on Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/watch?v=WGj6QLv6_as')}>
          <Text style={styles.link}>Visit us on YouTube</Text>
        </TouchableOpacity>
      </View>
    </AnimatedHeaderLayout>
  );
};

export default MoreScreen;
