import pool from "../config/db.config.js";

export interface User {
    id_user: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

export class User {
    public static async getAllUsers(): Promise<User[]> {
        const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
        return result.rows;
    }

    public static async getUserById(id: number): Promise<User | null> {
        const result = await pool.query("SELECT * FROM users WHERE id_user = $1", [id]);
        return result.rows[0] || null;
    }

    public static async getUserByEmail(email: string): Promise<User | null> {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0] || null;
    }

    public static async createUser(firstName: string, lastName: string, email: string, password: string): Promise<User> {
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [firstName, lastName, email, password]
        );
        return result.rows[0];
    }

    public static async updateUser(id: number, firstName: string, lastName: string, email: string): Promise<User | null> {
        const result = await pool.query(
            `UPDATE users
             SET first_name = $1, last_name = $2, email = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id_user = $4
             RETURNING *`,
            [firstName, lastName, email, id]
        );
        return result.rows[0] || null;
    }

    public static async deleteUser(id: number): Promise<boolean> {
        const result = await pool.query("DELETE FROM users WHERE id_user = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
