import { config } from "./config";
import { Note, Record } from "./interfaces/interfaces";

const API_URL = config.api.baseUrl;

/**
 * Récupère toutes les notes d'un utilisateur.
 * @param userId - ID de l'utilisateur
 * @returns Liste des notes
 */
export async function getAllNotes(userId: number): Promise<Note[]> {
    const response = await fetch(`${API_URL}/notes?user_id=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des notes");
    }
    return response.json();
}

/**
 * Récupère une note par son ID.
 * @param id - ID de la note
 * @returns Les données de la note
 */
export async function getNoteById(id: number): Promise<Note> {
    const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la note");
    }
    return response.json();
}

/**
 * Crée une nouvelle note.
 * @param recordId - ID du record
 * @param userId - ID de l'utilisateur
 * @param content - Contenu de la note
 * @returns Les données de la note créée
 */
export async function createNote(recordId: number, userId: number, content: string): Promise<Note> {
    const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_record: recordId, id_user: userId, content }),
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la création de la note");
    }
    return response.json();
}

/**
 * Récupère un record par son ID.
 * @param id - ID du record
 * @returns Les données du record
 */
export async function getRecordById(id: number): Promise<Record> {
    const response = await fetch(`${API_URL}/records/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération du record");
    }
    return response.json();
}

/**
 * Crée un nouveau record avec un fichier audio.
 * @param userId - ID de l'utilisateur
 * @param title - Titre du record
 * @param duration - Durée du record
 * @param fileUri - URI du fichier audio
 * @returns Les données du record créé
 */
export async function createRecord(userId: number, title: string, duration: number, fileUri: string): Promise<Record> {
    const formData = new FormData();
    formData.append("id_user", userId.toString());
    formData.append("title", title);
    formData.append("duration", duration.toString());
    formData.append("audio", {
        uri: fileUri,
        type: "audio/m4a",
        name: "recording.m4a",
    } as any);

    const response = await fetch(`${API_URL}/records`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la création du record");
    }
    return response.json();
}
