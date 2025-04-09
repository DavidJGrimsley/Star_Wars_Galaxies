import { useCallback, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FAVORITES_KEY } from '@/constants/keys'
import { Film } from '@/types/interfaces'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS } from '@/constants/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useFocusEffect } from 'expo-router'

const Page = () => {
  const [favorites, setFavorites] = useState<Film[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        setFavorites(JSON.parse(favorites))
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setRefreshing(false)
    }
  }
  const onRefresh = () => {
    setRefreshing(true)
    fetchFavorites()
  }

  const handleRemoveFavorite = async (film: Film) => {
    const updatedFavorites = favorites.filter((item) => item.episode_id !== film.episode_id)
    setFavorites(updatedFavorites)
    try { await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites)) 
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  const renderItem = ({ item }: { item: Film }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.text}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleRemoveFavorite(item)}>
          <Ionicons name="trash-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    )
  }

  useFocusEffect(
    useCallback(() => {
        console.log("🚀 ~ useFocusEffect ~ favorites:", favorites)
        fetchFavorites()
    }, [])
  )

  return (
      <View style={styles.container}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.episode_id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.title}>No favorites yet</Text>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.text} />
          }
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} // Center content both vertically and horizontally
        />
      </View>
    )
}

export default Page
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    // width: '80%',
  },
  text: { 
    fontSize: 24,
    color: COLORS.text,
    flexShrink: 1, // Prevent text from wrapping unnecessarily
    marginRight: 16, // Add spacing between text and icon
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  itemContainer: {
    backgroundColor: COLORS.itemBackground, // Match FilmItem style
    padding: 16, // Use consistent padding
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8, // Match FilmItem style
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure proper alignment
    minWidth: '80%', // Ensure the item takes up a minimum width
  },
})

