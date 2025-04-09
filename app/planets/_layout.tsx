import { COLORS } from '@/constants/colors'
import { Stack } from 'expo-router'
import { View, Text } from 'react-native'

const Layout = () => {
  return (
    <Stack
        screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
            backgroundColor: COLORS.background,
            },
            headerTintColor: COLORS.text,
            headerTitleAlign: "center", // Center the header title
            headerTitleStyle: {
            fontWeight: "bold",
            },
            contentStyle: { backgroundColor: COLORS.background },
        }}>
        <Stack.Screen name="index" options={{ title: 'All Planets' }} />
        <Stack.Screen name="[id]" options={{ title: 'Planet details' }} />
        
    </Stack>
  )
}

export default Layout