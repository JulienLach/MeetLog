import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Notes() {
    const handleRecord = () => {
        // TODO: Implémenter l'enregistrement audio
        console.log("Enregistrement démarré");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
                <Ionicons name="mic" size={23} color="white" />
                <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
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
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
});
