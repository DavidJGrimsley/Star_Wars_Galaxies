import { COLORS } from '@/constants/colors'
import { Stack } from 'expo-router'
import { View, Text, Image } from 'react-native'

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
            // contentStyle: { backgroundColor: COLORS.background },
        }}>
        <Stack.Screen name="index" options={{ 
          headerTitle: () => (
            <Image
              source={require("../../assets/images/translogo3x.png")} // Replace with your image path
              style={{ width: 200, height: 60, resizeMode: "contain" }} // Adjust size as needed
            />
          ), }} 
        />
        <Stack.Screen name="[id]" options={{ 
          headerTitle: () => (
            <Image
              source={require("../../assets/images/logo3x.png")} // Replace with your image path
              style={{ width: 200, height: 60, resizeMode: "contain" }} // Adjust size as needed
            />
          ), }} 
        />
        <Stack.Screen 
            name="crawl" 
            options={{ 
                title: '', 
                presentation: 'modal', // Turn this screen into a modal
                // headerBackground: () => (
                //     <Image
                //         source={require("../../assets/images/stars3x.png")} // Replace with your image path
                //         style={{ width: 200, height: 60, resizeMode: "contain" }} // Adjust size as needed
                //     />
                // ),
            }} 
        />
    </Stack>
  )
}

export default Layout