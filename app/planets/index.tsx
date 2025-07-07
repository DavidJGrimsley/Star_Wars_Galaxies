import { useEffect, useState } from 'react'
import { FlatList, ImageBackground, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { Planet } from '@/types/interfaces'
import Loading from '@/components/Loading'
import PlanetItem from '@/components/PlanetItem'
import ListLoading from '@/components/ListLoading'; // Import ListLoading
import { useRouter } from 'expo-router'; // Add router import

const Page = () => {
    const router = useRouter(); // Add router hook
    const [planets, setPlanets] = useState<Planet[]>([])
    const [loading, setLoading] = useState(false)
    const [listLoading, setListLoading] = useState(false); // Adjusted initial state
    const [error, setError] = useState<string | null>(null)
    const [nextPage, setNextPage] = useState<string | null>('https://swapi.py4e.com/api/planets/?page=1')
    const [refreshing, setRefreshing] = useState(false)
    const firstPage = 'https://swapi.py4e.com/api/planets/?page=1'
    const [hasReachedEnd, setHasReachedEnd] = useState(false); // Track if we've reached the end

    const fetchPlanets = async (url: string) => {
        if (hasReachedEnd) return; // Stop fetching if we've reached the end
        if (url === firstPage && planets.length > 0) {
            setHasReachedEnd(true); // Mark as end if we're back to the first page
            return;
        }

        if (url === firstPage) {
            setLoading(true);
        } else {
            setListLoading(true); // Start list loading for subsequent pages
        }
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            setPlanets((prevPlanets) => [...prevPlanets, ...data.results])
            setNextPage(data.next)
        } catch (error) {
            setError('Failed to load planets')
        } finally {
            setLoading(false);
            setListLoading(false); // Stop list loading
            setRefreshing(false);
        }
    }

    useEffect(() => {
        if (nextPage) {
            fetchPlanets(nextPage)
        }
    }, [])

    const onRefresh = () => {
        setRefreshing(true)
        setPlanets([]) // Clear the current planets list
        setNextPage(firstPage); // Reset to the initial URL
        setHasReachedEnd(false); // Reset the end flag
        fetchPlanets(firstPage);
    }

    const loadMore = () => {
        if (nextPage && !hasReachedEnd) {
            console.log("🚀 ~ nextpage ~ fetch:", nextPage)
            fetchPlanets(nextPage) // Fetch the next page
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <ImageBackground style={styles.image} source={require('@/assets/images/ship3x.jpg')} resizeMode="cover">
            <View style={styles.container}>
                <FlatList
                    data={planets}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => <PlanetItem item={item} />}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.9}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No planets found</Text>}
                    ListFooterComponent={listLoading ? <ListLoading /> : null} // Show ListLoading at the bottom
                />
            </View>
        </ImageBackground>
    )
}

export default Page
const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        color: '#000',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
})
