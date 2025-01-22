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

      {/* Front Office Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Front Office</Text>
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('/more/StudentBoard')}>
          {/* <Text style={styles.rowText}>Student Officers</Text> */}
          <Link href="/more/StudentBoard" style={styles.rowText}>Student Officers</Link>
          <Icon name="chevron-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('/more/CoachingStaff')}>
          {/* <Text style={styles.rowText}>Coaching Staff</Text> */}
          <Link href="/more/CoachingStaff" style={styles.rowText}>Coaching Staff</Link>
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
          onPress={() => Linking.openURL('https://www.instagram.com/gatechlax/')}>
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
          onPress={() => Linking.openURL('https://www.facebook.com/GeorgiaTechMensLacrosse/')}>
          <Text style={styles.rowText}>Visit us on Facebook</Text>
          <Icon name="chevron-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('https://www.youtube.com/@GTmenslacrosse')}>
          <Text style={styles.rowText}>Visit us on YouTube</Text>
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
