import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';

const MoreScreen = () => {
  const router = useRouter();

  return (
    <AnimatedHeaderLayout headerText="More" backgroundColor={styles.container.backgroundColor}>
    {/* <ScrollView contentContainerStyle={styles.container}> */}
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>More</Text>
      </View>

      {/* All Seasons Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>All Seasons</Text>
        <TouchableOpacity onPress={() => router.push('/screens/oldSeason?year=2024-25')}>
          <Text style={styles.link}>2024-25 Season</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/oldSeason?year=2023-24')}>
          <Text style={styles.link}>2023-24 Season</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/oldSeason?year=2022-23')}>
          <Text style={styles.link}>2022-23 Season</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/oldSeason?year=2021-22')}>
          <Text style={styles.link}>2021-22 Season</Text>
        </TouchableOpacity>
      </View>

      {/* Front Office Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Front Office</Text>
        <TouchableOpacity onPress={() => router.push('/screens/StudentBoard')}>
          <Text style={styles.link}>Student Board</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/CoachingStaff')}>
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.navyBlue, // Dark blue background
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.techDarkGold, // Gold text
    marginBottom: 10,
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
  link: {
    fontSize: 16,
    color: Colors.piMile, // Light gray text
    paddingVertical: 5,
    fontFamily: 'Roboto-Regular', // Apply Roboto-Regular font
  },
});

export default MoreScreen;
