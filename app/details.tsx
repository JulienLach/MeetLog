import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { getNoteById, type Note } from "./lib/api";

export default function NoteDetail() {
    const { id } = useLocalSearchParams();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNote = async () => {
            if (!id) {
                setError("ID de note manquant");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const fetchedNote = await getNoteById(Number(id));
                setNote(fetchedNote);
            } catch (err) {
                setError("Erreur lors du chargement de la note");
            } finally {
                setLoading(false);
            }
        };

        loadNote();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0a7ea4" />
            </View>
        );
    }

    if (error || !note) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error || "Note introuvable"}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Note {note.id_record}</Text>
                <Text style={styles.date}>{new Date(note.created_at).toLocaleDateString("fr-FR")}</Text>

                <View style={styles.divider} />

                <Text style={styles.summaryTitle}>Contenu</Text>
                <Text style={styles.summary}>{note.content}</Text>
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
