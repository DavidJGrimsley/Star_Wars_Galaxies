import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, ImageBackground, Image } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';

const Page = () => {
  const screenHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenHeight + 200)).current;
  const viewOpacity = useRef(new Animated.Value(0)).current; // Opacity for the View with texts
  const logoScale = useRef(new Animated.Value(1)).current; // Scale for the logo
  const logoOpacity = useRef(new Animated.Value(0)).current; // Opacity for the logo
  const crawlScale = useRef(new Animated.Value(1)).current; // Start at full size
  const { filmCrawl } = useLocalSearchParams();
  const filmCrawlString: string = filmCrawl as string;
  const soundRef = useRef<Audio.Sound | null>(null);

  if (!filmCrawl) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No opening crawl provided!</Text>
      </View>
    );
  }

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Animation and sound logic
  useEffect(() => {
    // Step 1: Fade in the View with texts
    const step1 = Animated.timing(viewOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    const step1b = Animated.timing(viewOpacity, {
      toValue: 0,
      duration: 1000,
      delay: 3000,
      useNativeDriver: true,
    });

    // Step 2: Scale and fade in the logo
    const step2 = Animated.parallel([
      Animated.timing(logoOpacity, {
        delay: 2000,
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        delay: 2000,
        toValue: 0.05,
        duration: 12000,
        useNativeDriver: true,
      })
    ]);

    // Step 3: Fade out the logo
    const step3 = Animated.timing(logoOpacity, {
      delay: -1000,
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    });

    // Sequence with callback for step 2
    Animated.sequence([
      step1,
      step1b,
    ]).start(() => {
      // Play sound at step 2
      (async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('@/assets/audio/starwars_theme.mp3')
          );
          soundRef.current = sound;
          await sound.setVolumeAsync(0.05);
          await sound.playAsync();
        } catch (error) {
          console.error('Error loading or playing sound:', error);
        }
      })();
      // Start logo animation after sound starts
      Animated.sequence([
        step2,
        step3,
      ]).start();
    });

    // Step 4: Animate the crawl text
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -1000,
        duration: 70000,
        delay: 4000,
        useNativeDriver: true,
      }),
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