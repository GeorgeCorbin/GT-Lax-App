import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import styles from '../../constants/styles/more';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import { Link } from 'expo-router';
import appJson from '../../app.json';
const { version } = appJson.expo;

const MoreScreen = () => {

  return (
    <AnimatedHeaderLayout headerText="" backgroundColor={styles.container.backgroundColor}>
      {/* Header */}
      <View style={styles.header}>
      </View>

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

      {/* Admin Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionHeader}>Other</Text>
        <Link href="/more/admin/AdminLogin" style={styles.link}>
          Admin Panel
        </Link>
      </View> */}

      {/* Fine Print */}
      <View style={styles.finePrintContainer}>
      <Text style={styles.finePrint}>Developed by George Corbin #31</Text>
      <Text style={styles.finePrint}>Player from 2022 - 2026</Text>
      <Text style={styles.finePrint}>Version {version}</Text>
      </View>
    </AnimatedHeaderLayout>
  );
};

export default MoreScreen;
