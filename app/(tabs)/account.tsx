import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Account() {
    const router = useRouter();
    // TODO: Récupérer les données utilisateur
    const userData = {
        email: "utilisateur@example.com",
        notesCount: 12,
        lastRecording: "2024-01-15",
    };

    const handleLogout = () => {
        router.replace("/login");
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoCard}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{userData.email}</Text>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.label}>Mot de passe</Text>
                <Text style={styles.value}>••••••••</Text>
            </View>

            <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>Statistiques</Text>
                <Text style={styles.stat}>{userData.notesCount} notes enregistrées</Text>
                <Text style={styles.stat}>Dernière réunion: {userData.lastRecording}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#333",
    },
    infoCard: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    statsCard: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
        color: "#333",
    },
    stat: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    logoutButton: {
        backgroundColor: "#424242",
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: "auto",
        alignItems: "center",
    },
    logoutText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
});
