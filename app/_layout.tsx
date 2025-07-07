import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet } from "react-native";


export default function RootLayout() {
  const router = useRouter();

  return (
    <Tabs
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
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.text,
          borderTopWidth: 2, // Increase border width for better visibility
        },
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: COLORS.inactive,
      }}
    >
      <Tabs.Screen
        name="films"
        options={{
          title: "Films",
          tabBarLabel: "Movies",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default behavior if needed
            e.preventDefault();
            router.replace("/films");
          },
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: "All People",
          headerShown: false,
          tabBarLabel: "Characters",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "My Favorites",
          tabBarLabel: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="planets"
        options={{
          title: "All Planets",
          headerShown: false,
          tabBarLabel: "Homeworlds",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
