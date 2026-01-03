import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
                name="details"
                options={{
                    headerShown: true,
                    title: "Détails",
                    headerBackTitle: "Retour",
                }}
            />
        </Stack>
    );
}
