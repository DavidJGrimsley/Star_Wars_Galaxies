import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, ImageBackground, Image } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useLocalSearchParams } from 'expo-router';

const Page = () => {
  const screenHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenHeight + 200)).current;
  const viewOpacity = useRef(new Animated.Value(0)).current; // Opacity for the View with texts
  const logoScale = useRef(new Animated.Value(1)).current; // Scale for the logo
  const logoOpacity = useRef(new Animated.Value(0)).current; // Opacity for the logo
  const crawlScale = useRef(new Animated.Value(1)).current; // Start at full size
  const { filmCrawl } = useLocalSearchParams();
  const filmCrawlString: string = filmCrawl as string;

  if (!filmCrawl) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No opening crawl provided!</Text>
      </View>
    );
  }

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Step 1: Fade in the View with texts
      Animated.timing(viewOpacity, {
        toValue: 1,
        duration: 1000, // 1 second fade-in
        useNativeDriver: true,
      }),
      Animated.timing(viewOpacity, {
        toValue: 0,
        duration: 1000, // 1 second fade-out after 5 seconds
        delay: 4000, // Wait for 4 seconds before fading out
        useNativeDriver: true,
      }),

      // Step 2: Scale and fade in the logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000, // 1 second fade-in
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.05, // Shrink to 1/20th of the size
          duration: 12000, // 10 seconds
          useNativeDriver: true,
        }),
      ]),

      // Step 3: Fade out the logo
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 1000, // 1 second fade-out
        useNativeDriver: true,
      }),
    ]).start();

    // Step 4: Animate the crawl text
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -1000, // Move the text far up
        duration: 70000, // Duration of the animation (70 seconds)
        delay: 4000, // Delay before starting the crawl
        useNativeDriver: true,
      }),
      // Animated.timing(crawlScale, {
      //   toValue: 0.5, // Shrink to 50% of the original size
      //   duration: 70000, // Match the duration of the crawl
      //   delay: 8000, // Delay before starting the crawl
      //   useNativeDriver: true,
      // }),
    ]).start();
  }, [viewOpacity, logoScale, logoOpacity, translateY, crawlScale]);

  return (
    <ImageBackground
      style={styles.container}
      source={require('@/assets/images/stars3x.png')} // Replace with your image URL
      resizeMode="cover"
    >
      {/* Step 1: Animated View with texts */}
      <Animated.View
        style={[
          styles.galaxy,
          {
            opacity: viewOpacity, // Animate opacity to fade in/out
            zIndex: 10, // Keep this static for layering
          },
        ]}
      >
        <Text style={styles.galaxyText}>A long time ago in a galaxy far,</Text>
        <Text style={styles.galaxyText}>far away....</Text>
      </Animated.View>

      {/* Step 2: Animated logo */}
      <Animated.Image
        style={[
          styles.logo,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity, // Animate opacity to fade in/out
            zIndex: 5, // Keep this static for layering
          },
        ]}
        source={require('@/assets/images/translogo3x.png')}
        resizeMode="contain" // Ensure the logo maintains its aspect ratio
      />

      {/* Step 3: Crawl text */}
      <Animated.Text
        style={[
          styles.crawl,
          {
            transform: [
              { translateY }, // Move the text upward
              { scale: crawlScale }, // Shrink the text
              { rotateX: '45deg' }, // Tilt the text backward
            ],
          },
        ]}
      >
        {filmCrawlString}
      </Animated.Text>
    </ImageBackground>
  );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: COLORS.itemBackground,
        padding: 16,
    },
    crawl: {
        fontSize: 64,
        fontWeight: 'bold',
        lineHeight: 64, // Adjust line height for spacing
        color: COLORS.text,
        textAlign: 'center',
        fontStyle: 'italic',
        width: '100%', // Start at full width
    },
    error: {
        color: '#fff',
        fontSize: 18,
    },
    logo: {
        width: Dimensions.get('window').width, // Full screen width
        height: Dimensions.get('window').height, // Full screen height
        position: 'absolute',
    },
    galaxy: {
        position: 'absolute',
        top: 0,
        left: '25%',
        right: 0,
        bottom: 0, // Ensures full-screen coverage
        justifyContent: 'center', // Centers the view vertically
        alignItems: 'center', // Centers the view horizontally
        paddingHorizontal: 20, // Adds padding on the left and right
        zIndex: 10, // Ensures it appears above other elements
    },
    galaxyText: {
        color: 'blue',
        fontSize: 64, // Adjust font size as needed
        // textAlign: 'left', // Aligns the text to the left
        alignSelf: 'flex-start', // Ensures the text aligns to the left within the parent
        // width: '100%', // Ensures the text spans the full width of the parent
  },
});