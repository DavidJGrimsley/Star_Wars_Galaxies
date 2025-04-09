import { COLORS } from '@/constants/colors';
import { Stack } from 'expo-router';
import { PeopleProvider } from '../context/PeopleContext';

const Layout = () => {
  return (
    <PeopleProvider>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={({ navigation }) => ({
            title: 'All Characters',
            headerSearchBarOptions: {
              placeholder: 'Search characters...',
              onChangeText: (e) => {
                const query = e.nativeEvent.text;
                navigation.setParams({ query });
              },
            },
          })}
        />
        <Stack.Screen name="[id]" options={{ title: 'Character details' }} />
      </Stack>
    </PeopleProvider>
  );
};

export default Layout;