import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ImageBackground, View } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useLocalSearchParams } from 'expo-router';
import { Planet } from '@/types/interfaces';
import { fetchData } from '@/helpers/apiHelpers';
import Loading  from '@/components/Loading'; // Import the Loading component

const Page = () => {
  const { id } = useLocalSearchParams(); // Retrieve the slug from the URL
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanet = async () => {
      try {
        const data = await fetchData<Planet>(`https://swapi.dev/api/planets/${id}/`); // Use helper
        console.log("🚀 ~ fetchPlanet ~ json:", data);
        setPlanet(data); // Directly set the planet object
      } catch (error) {
        setError('Failed to load planet');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlanet();
    }
  }, [id]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!planet) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Loading planet...</Text>
      </View>
    );
  }

  if (loading) {
    return <Loading />
}

  return (
    <ImageBackground
      source={require('../../assets/images/space3x.jpg')} // Replace with your image URL
      style={styles.background}
    >
        <View style={styles.container}>
        <Text style={styles.title}>{planet.name}</Text>
        <Text style={styles.detail}>Climate: {planet.climate}</Text>
        <Text style={styles.detail}>Population: {planet.population}</Text>
        <Text style={styles.detail}>Terrain: {planet.terrain}</Text>
        </View>
        
    </ImageBackground>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.itemBackground,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  detail: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  error: {
    color: '#fff',
    fontSize: 18,
  },
  background: {
    flex: 1, // Ensure the ImageBackground fills the screen
  },
});