import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import styles from '../../constants/styles/more';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import appJson from '../../app.json';
import Icon from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';

const { version } = appJson.expo;

const MoreScreen = () => {
  return (
    <AnimatedHeaderLayout headerText="" backgroundColor={styles.container.backgroundColor}>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>About</Text>
        <View style={styles.row}>
          <Link href="/more/TeamHistory" style={styles.rowText}>
              What is Georgia Tech Lacrosse?
          </Link>
          <Link href="/more/TeamHistory" style={styles.rowArrow}>
            <Icon name="chevron-forward" style={styles.arrowIcon} />
          </Link>
        </View>
        <View style={styles.row}>
          <Link href="/more/LeagueInfo" style={styles.rowText}>
              What are the MCLA & SELC?
          </Link>
          <Link href="/more/LeagueInfo" style={styles.rowArrow}>
            <Icon name="chevron-forward" style={styles.arrowIcon} />
          </Link>
        </View>
        <View style={styles.row}>
          <Link href="/more/TeamSuccess" style={styles.rowText}>
              Team Success
          </Link>
          <Link href="/more/TeamSuccess" style={styles.rowArrow}>
            <Icon name="chevron-forward" style={styles.arrowIcon} />
          </Link>
        </View>
      </View>

      {/* Front Office Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Front Office</Text>
        <View style={styles.row}>
          <Link href="/more/StudentBoard" style={styles.rowText}>
            Student Officers
          </Link>
          <Link href="/more/StudentBoard" style={styles.rowArrow}>
            <Icon name="chevron-forward" style={styles.arrowIcon} />
          </Link>
        </View>
        <View style={styles.row}>
          <Link href="/more/CoachingStaff" style={styles.rowText}>
            Coaching Staff
          </Link>
          <Link href="/more/CoachingStaff" style={styles.rowArrow}>
            <Icon name="chevron-forward" style={styles.arrowIcon} />
          </Link>
        </View>
      </View>

      {/* Social Media Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Social Media</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('https://www.gtlacrosse.com/')}>
          <Text style={styles.rowText}>Visit our Website</Text>
          <Icon name="chevron-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('https://www.instagram.com/gtlacrosse/')}>
          <Text style={styles.rowText}>Visit us on Instagram</Text>
          <Icon name="chevron-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('https://twitter.com/GaTechLAX')}>
          <Text style={styles.rowText}>Visit us on Twitter</Text>
          <Icon name="chevron-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('https://www.youtube.com/@GTmenslacrosse')}>
          <Text style={styles.rowText}>Visit us on YouTube</Text>
          <Icon name="chevron-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('https://www.facebook.com/GeorgiaTechMensLacrosse/')}>
          <Text style={styles.rowText}>Visit us on Facebook</Text>
          <Icon name="chevron-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Contact</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('mailto:gtmenslacrosse@gmail.com')}>
          <Text style={styles.rowText}>Contact Team</Text>
          <Icon name="chevron-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('mailto:george.software.llc@gmail.com')}>
          <Text style={styles.rowText}>Contact the Developer</Text>
          <Icon name="chevron-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

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
