import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Loading from '@/components/Loading';
import { Character, Planet } from '@/types/interfaces';
import { fetchData } from '@/helpers/apiHelpers';

const Page = () => {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filmTitles, setFilmTitles] = useState<string[]>([]);
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [planetId, setPlanetId] = useState<string>(''); // State to store planet ID

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const data = await fetchData<Character>(`https://swapi.dev/api/people/${id}/`); // Use helper
        setCharacter(data);

        // Fetch planet aka homeworld using the reusable function
        const planetData = await fetchData<Planet>(data.homeworld); // Use helper for homeworld
        setPlanetId(planetData.url.split('/').filter(Boolean).pop() || '') // Extract numeric ID
        setPlanet(planetData); // Store the id in the planet object

        fetchFilmTitles(data.films); // Fetch film titles
      } catch (error) {
        setError('Failed to load character');
        console.error('Error fetching character:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCharacter();
    }
  }, [id]);

  const fetchFilmTitles = async (filmUrls: string[]) => {
    try {
      const titles = await Promise.all(
        filmUrls.map(async (url) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch film details');
          }
          const filmData = await response.json();
          return filmData.title; // Extract the title
        })
      );
      setFilmTitles(titles); // Update state with film titles
    } catch (error) {
      console.error('Error fetching film titles:', error);
    }
  };


  if (loading) {
    return <Loading />;
  }

  if (!character) {
    return <Text style={{ color: '#fff' }}>Character not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{character.name}</Text>
      <Text style={styles.detail}>Height: {character.height}</Text>
      <Text style={styles.detail}>Mass: {character.mass}</Text>
      <Text style={styles.detail}>Hair Color: {character.hair_color}</Text>
      <Text style={styles.detail}>Skin Color: {character.skin_color}</Text>
      <Text style={styles.detail}>Eye Color: {character.eye_color}</Text>
      <Text style={styles.detail}>Birth Year: {character.birth_year}</Text>
      <Text style={styles.detail}>Gender: {character.gender}</Text>
      <Text style={styles.detail}></Text>
      <Link href={`../planets/${planetId}`} asChild> 
        <TouchableOpacity>
          <Text style={styles.detail}>
            View Homeworld: {planet ? planet.name : 'Unknown'}
          </Text>
        </TouchableOpacity>
      </Link>
      
      <Text style={styles.head}>Films:</Text>
      <FlatList
        data={filmTitles}
        keyExtractor={(title) => title}
        renderItem={({ item: title }) => (
          <Text style={styles.detail}>{title}</Text>
        )}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 16,
    backgroundColor: COLORS.containerBackground,
  },
  head: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
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
});