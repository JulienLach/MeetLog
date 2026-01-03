import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface MeetingNote {
    id: string;
    title: string;
    date: string;
    summary: string;
    duration: string;
}

// TODO: Remplacer par appel API
const MOCK_NOTES: Record<string, MeetingNote> = {
    "1": {
        id: "1",
        title: "Stand-up Sprint 15",
        date: "06/02/2026",
        summary:
            "Discussion sur les tâches en cours, blocages identifiés sur l'API. Les points soulevés : amélioration de la performance du serveur, refactorisation du code legacy...",
        duration: "15 min",
    },
    "2": {
        id: "2",
        title: "Réunion planning Sprint 16",
        date: "27/01/2026",
        summary:
            "Définition des objectifs du prochain sprint, priorisation des features. Nouvelles features : intégration IA, amélioration UX...",
        duration: "45 min",
    },
    "3": {
        id: "3",
        title: "Retro Sprint 14",
        date: "14/01/2026",
        summary:
            "Analyse des points d'amélioration, célébration des réussites. À améliorer : communication interne, planning plus réaliste...",
        duration: "30 min",
    },
};

export default function NoteDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const note = id ? MOCK_NOTES[id as string] : null;

    if (!note) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Note introuvable</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.date}>{note.date}</Text>
                <Text style={styles.duration}>Durée: {note.duration}</Text>

                <View style={styles.divider} />

                <Text style={styles.summaryTitle}>Résumé</Text>
                <Text style={styles.summary}>{note.summary}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    content: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    duration: {
        fontSize: 12,
        color: "#999",
        fontStyle: "italic",
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 16,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
    },
    summary: {
        fontSize: 14,
        color: "#666",
        lineHeight: 22,
    },
    errorText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
    },
});
