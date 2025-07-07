import { FlatList, ImageBackground, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS } from '@/constants/colors'
import { Film } from '@/types/interfaces'
import { useEffect, useState } from 'react'
import FilmItem from '@/components/FilmItem'
import ListEmptyComponent from '@/components/ListEmptyComponent'
import Loading from '@/components/Loading'
// import { Href } from 'expo-router/build/Link.types'

const Page = () => {
  const [films, setFilms] = useState<Film[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFilms = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://swapi.py4e.com/api/films/')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log("🚀 ~ fetchFilms ~ data:", data)
      setFilms(data.results)
    } catch (error) {
      setError('Failed to load films')
      console.error('Error fetching films:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchFilms()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchFilms()
  }

  if (loading) {
    return <Loading />;
  }

  

  return (

    <ImageBackground
      source={require('@/assets/images/space3x.jpg')}
      style={styles.container}
    >
      <View >
        <FlatList
          data={films}
          keyExtractor={(item) => item.episode_id.toString()}
          renderItem={({item}) => <FilmItem item={item}/>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.text}/>
          }
          ListEmptyComponent={<ListEmptyComponent loading={loading} message='Hi there'/>}
        > </FlatList>
      </View>
    </ImageBackground>
  )
}
//  />

export default Page
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.containerBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    error: {
        color: COLORS.text,
        textAlign: 'center',
        marginVertical: 20,
    },
})
