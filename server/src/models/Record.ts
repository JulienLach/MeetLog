import pool from "../config/db.config.js";

export interface Record {
    id_record: number;
    id_user: number;
    title: string;
    duration: number;
    file_uri: string;
    file_size: number;
    status: "pending" | "processing" | "completed" | "error";
    created_at: Date;
    updated_at: Date;
}

export class Record {
    public static async getAllRecords(): Promise<Record[]> {
        const result = await pool.query("SELECT * FROM records ORDER BY created_at DESC");
        return result.rows;
    }

    public static async getRecordById(id: number): Promise<Record | null> {
        const result = await pool.query("SELECT * FROM records WHERE id_record = $1", [id]);
        return result.rows[0] || null;
    }

    public static async getRecordsByUserId(userId: number): Promise<Record[]> {
        const result = await pool.query("SELECT * FROM records WHERE id_user = $1 ORDER BY created_at DESC", [userId]);
        return result.rows;
    }

    public static async getRecordsByStatus(status: string): Promise<Record[]> {
        const result = await pool.query("SELECT * FROM records WHERE status = $1 ORDER BY created_at DESC", [status]);
        return result.rows;
    }

    public static async createRecord(
        userId: number,
        title: string,
        duration: number,
        fileUri: string,
        fileSize: number
    ): Promise<Record> {
        const result = await pool.query(
            `INSERT INTO records (id_user, title, duration, file_uri, file_size, status)
             VALUES ($1, $2, $3, $4, $5, 'pending')
             RETURNING *`,
            [userId, title, duration, fileUri, fileSize]
        );
        return result.rows[0];
    }

    public static async updateRecord(id: number, title: string, duration: number): Promise<Record | null> {
        const result = await pool.query(
            `UPDATE records
             SET title = $1, duration = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id_record = $3
             RETURNING *`,
            [title, duration, id]
        );
        return result.rows[0] || null;
    }

    public static async updateRecordStatus(id: number, status: string): Promise<Record | null> {
        const result = await pool.query(
            `UPDATE records
             SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id_record = $2
             RETURNING *`,
            [status, id]
        );
        return result.rows[0] || null;
    }

    public static async deleteRecord(id: number): Promise<boolean> {
        const result = await pool.query("DELETE FROM records WHERE id_record = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
