import React from 'react';
import { usePeople } from '../../helpers/PeopleContext';
import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import CharacterItem from '@/components/CharacterItem';
import Loading from '@/components/Loading';
import { useLocalSearchParams } from 'expo-router';

const Page = () => {
  console.log('Try to usepeople)')
  const { people, loading } = usePeople(); // Use the context to get the list of people and loading state
  console.log('Usedpeople)')
  const params = useLocalSearchParams();

  const searchQuery = params.query ? (params.query as string) : '';

  // Filter the list of people based on the search query
  const filteredPeople = searchQuery
    ? people.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : people; // Show full list when searchQuery is empty

  if (loading) {
    return <Loading />;
  }

  return (
    <ImageBackground
      source={require('@/assets/images/yoda3x.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Character List */}
        <FlatList
          data={filteredPeople}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <CharacterItem character={item} />}
          contentInsetAdjustmentBehavior='automatic'
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No characters found</Text>}
        />
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
  },
});