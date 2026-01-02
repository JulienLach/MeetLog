import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MeetingNote {
    id: string;
    title: string;
    date: string;
    summary: string;
    duration: string;
}

export default function Index() {
    const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([
        {
            id: "1",
            title: "Stand-up Sprint 15",
            date: "06-02-2026",
            summary: "Discussion sur les tâches en cours, blocages identifiés sur l'API...",
            duration: "15 min",
        },
        {
            id: "2",
            title: "Réunion planning Sprint 16",
            date: "27-01-2026",
            summary: "Définition des objectifs du prochain sprint, priorisation des features...",
            duration: "45 min",
        },
        {
            id: "3",
            title: "Retro Sprint 14",
            date: "14-01-2026",
            summary: "Analyse des points d'amélioration, célébration des réussites...",
            duration: "30 min",
        },
    ]);

    const renderMeetingNote = ({ item }: { item: MeetingNote }) => (
        <TouchableOpacity style={styles.noteCard}>
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
});
