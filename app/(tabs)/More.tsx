import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../constants/styles/more'; // Updated path for styles
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import { Title } from 'react-native-paper';

const MoreScreen = () => {
  const router = useRouter();

  return (
    <AnimatedHeaderLayout headerText="More" backgroundColor={styles.container.backgroundColor}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>More</Text>
      </View>
  
      {/* All Seasons Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>All Seasons</Text>
        <TouchableOpacity onPress={() => { router.push('/more/OldSeason?year=2024-25'), router.setParams({Title: ''})}}>
          <Text style={styles.link}>2024-25 Season</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/more/OldSeason?year=2023-24')}>
          <Text style={styles.link}>2023-24 Season</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/more/OldSeason?year=2022-23')}>
          <Text style={styles.link}>2022-23 Season</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/more/OldSeason?year=2021-22')}>
          <Text style={styles.link}>2021-22 Season</Text>
        </TouchableOpacity>
      </View>

      {/* Front Office Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Front Office</Text>
        <TouchableOpacity onPress={() => router.push('/more/StudentBoard')}>
          <Text style={styles.link}>Student Board</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/more/CoachingStaff')}>
          <Text style={styles.link}>Coaching Staff</Text>
        </TouchableOpacity>
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
      </View>

      {/* Social Media Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Social Media</Text>
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
