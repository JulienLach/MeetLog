import pool from "../config/db.config.js";

export interface Note {
    id_note: number;
    id_record: number;
    id_user: number;
    content: string;
    created_at: Date;
    updated_at: Date;
}

export class Note {
    public static async getAllNotes(userId?: number): Promise<Note[]> {
        if (userId) {
            const result = await pool.query("SELECT * FROM notes WHERE id_user = $1 ORDER BY created_at DESC", [userId]);
            return result.rows;
        }
        const result = await pool.query("SELECT * FROM notes ORDER BY created_at DESC");
        return result.rows;
    }

    public static async getNoteById(id: number): Promise<Note | null> {
        const result = await pool.query("SELECT * FROM notes WHERE id_note = $1", [id]);
        return result.rows[0] || null;
    }

    public static async getNotesByRecordId(recordId: number): Promise<Note[]> {
        const result = await pool.query("SELECT * FROM notes WHERE id_record = $1 ORDER BY created_at DESC", [recordId]);
        return result.rows;
    }

    public static async createNote(recordId: number, userId: number, content: string): Promise<Note> {
        const result = await pool.query(
            `INSERT INTO notes (id_record, id_user, content)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [recordId, userId, content]
        );
        return result.rows[0];
    }

    public static async updateNote(id: number, content: string): Promise<Note | null> {
        const result = await pool.query(
            `UPDATE notes
             SET content = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id_note = $2
             RETURNING *`,
            [content, id]
        );
        return result.rows[0] || null;
    }

    public static async deleteNote(id: number): Promise<boolean> {
        const result = await pool.query("DELETE FROM notes WHERE id_note = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
