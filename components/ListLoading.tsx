import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/colors';

const ListLoading = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current; // Animation value for scaling

  useEffect(() => {
    // Create a loop animation for scaling
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5, // Scale up to 1.5x
          duration: 1000, // 1 second
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Scale back to original size
          duration: 1000, // 1 second
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    
      <View style={styles.container}>
        <Animated.Text
          style={[
            styles.text,
            { transform: [{ scale: scaleAnim }] }, // Apply scaling animation
          ]}
        >
          Loading
        </Animated.Text>
      </View>

  );
};

export default ListLoading;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  text: {
    color: 'yellow',
    fontSize: 50,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 0, 0.8)', // Glow effect color
    textShadowOffset: { width: 0, height: 0 }, // No offset
    textShadowRadius: 20, // Glow intensity
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});