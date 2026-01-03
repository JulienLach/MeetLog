import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#424242",
                tabBarInactiveTintColor: "#999",
                headerShown: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Notes",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    ),
                    headerTitle: "Notes",
                }}
            />
            <Tabs.Screen
                name="record"
                options={{
                    title: "Enregistrer",
                    tabBarIcon: ({ color, size }) => <Ionicons name="mic-outline" size={size} color={color} />,
                    headerTitle: "Enregistrer",
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: "Compte",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                    headerTitle: "Compte",
                }}
            />
        </Tabs>
    );
}
