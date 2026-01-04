const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api";

export interface Note {
    id_note: number;
    id_record: number;
    id_user: number;
    content: string;
    created_at: string;
    updated_at: string;
}

export async function getAllNotes(userId: number): Promise<Note[]> {
    const response = await fetch(`${API_URL}/notes?user_id=${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch notes");
    }
    return response.json();
}

export async function getNoteById(noteId: number): Promise<Note> {
    const response = await fetch(`${API_URL}/notes/${noteId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch note");
    }
    return response.json();
}

export interface Record {
    id_record: number;
    id_user: number;
    title: string;
    duration: number;
    file_uri: string;
    file_size: number;
    status: "pending" | "processing" | "completed" | "error";
    created_at: string;
    updated_at: string;
}

export async function createRecord(
    userId: number,
    title: string,
    duration: number,
    fileUri: string
): Promise<Record> {
    const formData = new FormData();
    formData.append("id_user", userId.toString());
    formData.append("title", title);
    formData.append("duration", duration.toString());

    // @ts-ignore - React Native FormData needs this structure
    formData.append("audio", {
        uri: fileUri,
        type: "audio/m4a", // ou le type approprié
        name: "recording.m4a",
    });

    const response = await fetch(`${API_URL}/records`, {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json",
            // Ne pas mettre Content-Type, fetch le fera avec le boundary pour FormData
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create record");
    }
    return response.json();
}

export async function createNote(recordId: number, userId: number, content: string): Promise<Note> {
    const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_record: recordId,
            id_user: userId,
            content,
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to create note");
    }
    return response.json();
}
