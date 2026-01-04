import { Note } from "../models/Note.js";

export async function getAllNotes(userId?: number) {
    if (userId) {
        return await Note.getAllNotes(userId);
    }
    return await Note.getAllNotes();
}

export async function getNoteById(id: number) {
    return await Note.getNoteById(id);
}

export async function getNotesByRecordId(recordId: number) {
    return await Note.getNotesByRecordId(recordId);
}

export async function createNote(recordId: number, userId: number, content: string) {
    return await Note.createNote(recordId, userId, content);
}

export async function updateNote(id: number, content: string) {
    return await Note.updateNote(id, content);
}

export async function deleteNote(id: number) {
    return await Note.deleteNote(id);
}
