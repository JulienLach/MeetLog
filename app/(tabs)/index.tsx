import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAllNotes, type Note } from "../lib/api";

interface MeetingNote {
    id: string;
    title: string;
    date: string;
    summary: string;
    duration: string;
}

export default function Index() {
    const router = useRouter();
    const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadNotes();
        }, [])
    );

    const loadNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const notes: Note[] = await getAllNotes(1);
            const mappedNotes: MeetingNote[] = notes.map((note) => ({
                id: note.id_note.toString(),
                title: `Note ${note.id_record}`,
                date: new Date(note.created_at).toLocaleDateString("fr-FR"),
                summary: note.content,
                duration: "",
            }));
            setMeetingNotes(mappedNotes);
        } catch (err) {
            setError("Erreur lors du chargement des notes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderMeetingNote = ({ item }: { item: MeetingNote }) => (
        <TouchableOpacity style={styles.noteCard} onPress={() => router.push(`/details?id=${item.id}`)}>
            <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.noteDate}>{item.date}</Text>
            </View>
            <Text style={styles.noteSummary} numberOfLines={2}>
                {item.summary}
            </Text>
            <View style={styles.noteFooter}>
                <Text style={styles.noteDuration}>Durée: {item.duration}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0a7ea4" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>{error}</Text>
                    <TouchableOpacity onPress={loadNotes} style={styles.retryButton}>
                        <Text style={styles.retryText}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {meetingNotes.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Aucune note de réunion enregistrée</Text>
                    <Text style={styles.emptySubtext}>Utilisez l'onglet Notes pour commencer un enregistrement</Text>
                </View>
            ) : (
                <FlatList
                    data={meetingNotes}
                    renderItem={renderMeetingNote}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    noteCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    noteHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        flex: 1,
    },
    noteDate: {
        fontSize: 14,
        color: "#666",
    },
    noteSummary: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 8,
    },
    noteFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    noteDuration: {
        fontSize: 12,
        color: "#999",
        fontStyle: "italic",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        textAlign: "center",
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        lineHeight: 20,
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: "#0a7ea4",
        borderRadius: 8,
    },
    retryText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
