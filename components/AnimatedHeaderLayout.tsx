import React, { useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Colors from '@/constants/Colors';

type AnimatedHeaderLayoutProps = {
  children: React.ReactNode;
  headerText: string;
  recordText?: string; // Optional, for pages like Schedule
  backgroundColor?: string;
};

const AnimatedHeaderLayout: React.FC<AnimatedHeaderLayoutProps> = ({
  children,
  headerText,
  recordText,
  backgroundColor = Colors.navyBlue, // Default to black if no color is provided
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animation
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [-100, 0],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return (
    <View style={[styles.container, { backgroundColor}]}>
      {/* Animated Header */}
      <Animated.View
        style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}
      >
        <Text style={styles.headerText}>{headerText}</Text>
        {recordText && <Text style={styles.recordText}>{recordText}</Text>}
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.navyTint,
    zIndex: 1000,
    padding: 4,
    elevation: 4, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular-bold',
  },
  recordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.techGold,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular-bold',
  },
});

export default AnimatedHeaderLayout;
