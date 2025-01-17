import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Adjust the path based on your project structure

const saveTokenToFirestore = async (token: string) => {
    try {
      const docRef = doc(db, "expoTokens", token);
      await setDoc(docRef, { token, timestamp: new Date() });
      console.log("Token stored in Firestore.");
    } catch (error) {
      console.error("Error storing token in Firestore:", error);
    }
};

const NotificationSetupScreen = () => {
  const router = useRouter();

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Notifications Disabled",
        "You can enable notifications later in your device settings."
      );
      // Set the flag in AsyncStorage to skip the onboarding in future launches
      await AsyncStorage.setItem("hasCompletedNotificationSetup", "true");
      router.replace("/(tabs)/"); // Navigate back to the main app
      return;
    }

    // Get the push token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    // Save the token to your backend
    // Firestore saving logic
    await saveTokenToFirestore(token);


    // Set the flag in AsyncStorage to skip the onboarding in future launches
    await AsyncStorage.setItem("hasCompletedNotificationSetup", "true");

    router.replace("/(tabs)/"); // Navigate back to the main app
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stay Updated!</Text>
      <Text style={styles.body}>
        Enable notifications for:
        {"\n"}- Game Information & Updates
        {"\n"}- Team Updates
        {"\n"}- Important Announcments
      </Text>
      <Text style={styles.subBody}>
      We value your time and promise not to send unnecessary or excessive notifications. You can manage or disable notifications anytime through your device settings.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={registerForPushNotificationsAsync}
      >
        <Text style={styles.buttonText}>Enable Notifications</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: Colors.textTitle,
    fontFamily: "roboto-regular-bold",
  },
  body: {
    fontSize: 24,
    textAlign: "left",
    color: Colors.textPrimary,
    marginBottom: 24,
    fontFamily: "roboto-regular",
  },
  subBody: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.textPrimary,
    marginBottom: 30,
    fontFamily: "roboto-regular",
  },
  button: {
    backgroundColor: Colors.buttonPrimary.background,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: Colors.grayMatter,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  buttonText: {
    color: Colors.buttonPrimary.text,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "roboto-regular-bold",
  },
});

export default NotificationSetupScreen;
