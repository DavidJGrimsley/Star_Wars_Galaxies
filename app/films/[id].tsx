import { Button, FlatList, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Film } from '@/types/interfaces';
import { COLORS } from '@/constants/colors';
import { FAVORITES_KEY } from '@/constants/keys'
import Ionicons from '@expo/vector-icons/Ionicons';
import Loading from '@/components/Loading';


const Page = () => {
  const { id } = useLocalSearchParams();
  const [film, setFilm] = useState<Film | null>(null);
  const [characters, setCharacters] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(`https://swapi.dev/api/films/${id}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFilm(data);
        checkFavoriteStatus(data); // Check favorite status after fetching film
        // Fetch character data
        const characterResponses = await Promise.all(
          data.characters.map((url: string) => fetch(url))
        );
        const characterData = await Promise.all(
          characterResponses.map((res) => res.json())
        );
        setCharacters(characterData);
      } catch (error) {
        setError('Failed to load film or characters');
        console.error('Error fetching film or characters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilm();
  }, [id]);

  const checkFavoriteStatus = async (film: Film) => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoriteFilms = JSON.parse(favorites) as Film[];
        setIsFavorite(favoriteFilms.some((f) => f.episode_id === film.episode_id)); 

      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } 
  }

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let favoriteFilms = favorites ? JSON.parse(favorites) : [] as Film[];

      if (isFavorite) {
        // Remove from favorites
        favoriteFilms = favoriteFilms.filter(
          (f:Film) => f.episode_id !== film?.episode_id)
          await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteFilms));
      } else {
        // Add to favorites
        favoriteFilms.push(film!);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteFilms));
      }
      setIsFavorite(!isFavorite); // Toggle the favorite status
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return <Loading/>;
  }

  if (!film) {
    return <Text style={{ color: '#fff' }}>Film not found</Text>;
  }

  // Clear all data in AsyncStorage (for testing purposes)
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear(); // Clears all keys in AsyncStorage
      console.log('AsyncStorage cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

 

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerRight: () => (
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={COLORS.text} />
          </TouchableOpacity>
        ),
      }}
      />
      <Text style={styles.title}>{film.title}</Text>
      <Text style={styles.detail}>Episode: {film.episode_id}</Text>
      <Text style={styles.detail}>Director: {film.director}</Text>
      <Text style={styles.detail}>Producer: {film.producer}</Text>
      <Text style={styles.detail}>Release Date: {film.release_date}</Text>
      <Text style={styles.head}>Characters:</Text>
      <FlatList
        data={characters}
        keyExtractor={(character) => character.name}
        renderItem={({ item: character }) => (
          <Text style={styles.detail}>{character.name}</Text>
        )}
      />
      
      <Button 
      title="Open Crawl Modal" 
      onPress={() => router.push({
        pathname: '/films/crawl',
        params: { filmCrawl: film.opening_crawl },
      })}
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