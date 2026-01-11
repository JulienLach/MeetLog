import pool from "../config/db.config";
import { RecordData } from "../interfaces/interfaces";

export class Record {
    static async getAllRecords(): Promise<RecordData[]> {
        const result = await pool.query("SELECT * FROM records ORDER BY created_at DESC");
        return result.rows;
    }

    static async getRecordById(id: number): Promise<RecordData | null> {
        const result = await pool.query("SELECT * FROM records WHERE id_record = $1", [id]);
        return result.rows[0] || null;
    }

    static async getRecordsByUserId(userId: number): Promise<RecordData[]> {
        const result = await pool.query("SELECT * FROM records WHERE id_user = $1 ORDER BY created_at DESC", [userId]);
        return result.rows;
    }

    static async getRecordsByStatus(status: string): Promise<RecordData[]> {
        const result = await pool.query("SELECT * FROM records WHERE status = $1 ORDER BY created_at DESC", [status]);
        return result.rows;
    }

    static async createRecord(
        userId: number,
        title: string,
        duration: number,
        fileUri: string,
        fileSize: number
    ): Promise<RecordData> {
        const result = await pool.query(
            "INSERT INTO records (id_user, title, duration, file_uri, file_size, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *",
            [userId, title, duration, fileUri, fileSize]
        );
        return result.rows[0];
    }

    static async updateRecord(id: number, title: string, duration: number): Promise<RecordData | null> {
        const result = await pool.query(
            "UPDATE records SET title = $1, duration = $2, updated_at = CURRENT_TIMESTAMP WHERE id_record = $3 RETURNING *",
            [title, duration, id]
        );
        return result.rows[0] || null;
    }

    static async updateRecordStatus(id: number, status: string): Promise<RecordData | null> {
        const result = await pool.query(
            "UPDATE records SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id_record = $2 RETURNING *",
            [status, id]
        );
        return result.rows[0] || null;
    }

    static async deleteRecord(id: number): Promise<boolean> {
        const result = await pool.query("DELETE FROM records WHERE id_record = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
