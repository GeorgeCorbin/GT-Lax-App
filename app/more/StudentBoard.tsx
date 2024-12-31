import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import Colors from '@/constants/Colors';
import { styles } from '@/constants/styles/studentBoard';
import axios from 'axios';

const StudentBoard = () => {
  interface StudentBoardMember {
    name: string;
    title: string;
    photo: string;
    bio: string;
  }
  
  const [studentBoardData, setStudentBoardData] = useState<StudentBoardMember[]>([]);

  useEffect(() => {
    const fetchStudentBoard = async () => {
      try {
        const response = await axios.get('https://gt-lax-app.web.app/studentBoard.json');
        setStudentBoardData(response.data);
      } catch (error) {
        console.error('Error fetching student board data:', error);
      }
    };

    fetchStudentBoard();
  }, []);

  return (
    <AnimatedHeaderLayout headerText="" backgroundColor={Colors.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Student Board</Text>
        {studentBoardData.map((member, index) => (
          <View key={index} style={styles.memberRow}>
            <View style={styles.photoContainer}>
              <Text style={styles.position}>{member.title}</Text>
              <Image source={{ uri: member.photo }} style={styles.photo} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{member.name}</Text>
              <Text style={styles.bio}>{member.bio}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </AnimatedHeaderLayout>
  );
};

export default StudentBoard;
