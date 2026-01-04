import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createNote, createRecord } from "../lib/api";

export default function Record() {
    const router = useRouter();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        // Configurer les permissions audio
        const setupAudio = async () => {
            try {
                await Audio.requestPermissionsAsync();
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
            } catch (err) {
                console.error("Erreur lors de la configuration audio:", err);
            }
        };

        setupAudio();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleRecord = async () => {
        try {
            if (isRecording && recordingRef.current) {
                // Arrêter l'enregistrement
                await recordingRef.current.stopAndUnloadAsync();
                const uri = recordingRef.current.getURI();
                const duration = recordingTime;

                setIsRecording(false);
                if (timerRef.current) clearInterval(timerRef.current);
                recordingRef.current = null;

                if (!uri) {
                    Alert.alert("Erreur", "Impossible de récupérer l'enregistrement");
                    return;
                }

                // Sauvegarder l'enregistrement
                setIsSaving(true);
                try {
                    const title = `Enregistrement ${new Date().toLocaleDateString("fr-FR")}`;
                    const userId = 1;

                    const record = await createRecord(userId, title, duration, uri);
                    await createNote(record.id_record, userId, "Note en attente de transcription...");

                    Alert.alert("Succès", "Enregistrement sauvegardé avec succès", [
                        { text: "OK", onPress: () => router.push("/(tabs)") },
                    ]);
                } catch (error) {
                    console.error("Erreur sauvegarde:", error);
                    Alert.alert("Erreur", "Impossible de sauvegarder l'enregistrement");
                } finally {
                    setIsSaving(false);
                    setRecordingTime(0);
                }
            } else {
                // Démarrer l'enregistrement
                const recording = new Audio.Recording();
                await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
                await recording.startAsync();
                recordingRef.current = recording;
                setIsRecording(true);
                setRecordingTime(0);

                // Timer pour afficher le temps d'enregistrement
                timerRef.current = setInterval(() => {
                    setRecordingTime((prev) => prev + 1);
                }, 1000);
            }
        } catch (err) {
            console.error("Erreur lors de l'enregistrement:", err);
            Alert.alert("Erreur", "Impossible de démarrer l'enregistrement");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    if (isSaving) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0a7ea4" />
                <Text style={styles.savingText}>Sauvegarde en cours...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isRecording ? (
                <View style={styles.recordingContainer}>
                    <View style={styles.recordingIndicator}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>En cours d'enregistrement</Text>
                    </View>
                    <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
                    <TouchableOpacity style={styles.stopButton} onPress={handleRecord}>
                        <Ionicons name="stop-outline" size={20} color="white" />
                        <Text style={styles.buttonText}>Arrêter</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
                    <Ionicons name="mic-outline" size={23} color="white" />
                    <Text style={styles.buttonText}>Enregistrer</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    recordButton: {
        backgroundColor: "#424242",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    recordingContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 15,
        paddingHorizontal: 30,
        paddingVertical: 35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    recordingIndicator: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    },
    recordingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#ff4444",
    },
    recordingText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#424242",
    },
    recordingTime: {
        fontSize: 36,
        fontWeight: "600",
        color: "#424242",
        marginBottom: 25,
        fontFamily: "monospace",
    },
    stopButton: {
        backgroundColor: "#ff4444",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    savingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
});
