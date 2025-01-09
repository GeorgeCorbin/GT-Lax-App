import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AnimatedHeaderLayout from '@/components/AnimatedHeaderLayout';
import Colors from '@/constants/Colors';
import { styles } from '@/constants/styles/admin';

const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Replace with actual authentication logic
    if (username === 'admin' && password === 'password') {
      Alert.alert('Login Successful', 'Welcome to the admin panel!');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return (
    <AnimatedHeaderLayout headerText="Admin Login" backgroundColor={Colors.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.button}>
          <Text style={styles.buttonText} onPress={handleLogin}>Login</Text>
        </View>
      </View>
    </AnimatedHeaderLayout>
  );
};

export default AdminPage;
