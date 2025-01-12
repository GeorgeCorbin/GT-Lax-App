import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import Colors from '@/constants/Colors';
import { styles } from '@/constants/styles/coachingStaff';
import axios from 'axios';

const CoachingStaff = () => {
  interface CoachingStaffMember {
    name: string;
    title: string;
    photo: string;
    bio: string;
  }
  
  const [CoachingStaffData, setCoachingStaffData] = useState<CoachingStaffMember[]>([]);

  useEffect(() => {
    const fetchCoachingStaff = async () => {
      try {
        const response = await axios.get('https://gt-lax-app.web.app/coaches.json');
        setCoachingStaffData(response.data);
      } catch (error) {
        console.error('Error fetching student board data:', error);
      }
    };

    fetchCoachingStaff();
  }, []);

  return (
    <AnimatedHeaderLayout headerText="Coaching Staff" backgroundColor={Colors.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {CoachingStaffData.map((coach, index) => (
          <View key={index} style={styles.memberRow}>
            <Text style={styles.position}>{coach.title}</Text>
            <View style={styles.rowContainer}>
              <View style={styles.photoContainer}>
                <Image source={{ uri: coach.photo }} style={styles.photo} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{coach.name}</Text>
                <Text style={styles.bio}>{coach.bio}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </AnimatedHeaderLayout>
  );
};

export default CoachingStaff;
