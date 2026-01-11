import pool from "../config/db.config";
import { NoteData } from "../interfaces/interfaces";

export class Note {
    static async getAllNotes(userId?: number): Promise<NoteData[]> {
        const query = userId
            ? "SELECT * FROM notes WHERE id_user = $1 ORDER BY created_at DESC"
            : "SELECT * FROM notes ORDER BY created_at DESC";
        const params = userId ? [userId] : [];
        const result = await pool.query(query, params);
        return result.rows;
    }

    static async getNoteById(id: number): Promise<NoteData | null> {
        const result = await pool.query("SELECT * FROM notes WHERE id_note = $1", [id]);
        return result.rows[0] || null;
    }

    static async getNotesByRecordId(recordId: number): Promise<NoteData[]> {
        const result = await pool.query("SELECT * FROM notes WHERE id_record = $1 ORDER BY created_at DESC", [
            recordId,
        ]);
        return result.rows;
    }

    static async createNote(recordId: number, userId: number, content: string): Promise<NoteData> {
        const result = await pool.query(
            "INSERT INTO notes (id_record, id_user, content) VALUES ($1, $2, $3) RETURNING *",
            [recordId, userId, content]
        );
        return result.rows[0];
    }

    static async updateNote(id: number, content: string): Promise<NoteData | null> {
        const result = await pool.query(
            "UPDATE notes SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id_note = $2 RETURNING *",
            [content, id]
        );
        return result.rows[0] || null;
    }

    static async deleteNote(id: number): Promise<boolean> {
        const result = await pool.query("DELETE FROM notes WHERE id_note = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
