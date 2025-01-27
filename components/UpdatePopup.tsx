import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Colors from '@/constants/Colors'; // Adjust path based on your structure

const UpdatePopup = () => {
  const [isVisible, setIsVisible] = useState(true);

  const hideModal = () => setIsVisible(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={hideModal}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>What's New!</Text>
          <Image
            source={require('../assets/video/update_108.gif')} // Local GIF
            style={styles.gif}
          />
          <Text style={styles.description}>
            Introducing the game information page! Now you can see all the details about individual games.
          </Text>
          <TouchableOpacity style={styles.button} onPress={hideModal}>
            <Text style={styles.buttonText}>Got It!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.textPrimary,
  },
  gif: {
    width: 300,
    height: 500,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.buttonPrimary.background,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.buttonPrimary.text,
    fontWeight: 'bold',
  },
});

export default UpdatePopup;
