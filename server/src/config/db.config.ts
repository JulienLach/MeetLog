import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const dbHost = process.env.NODE_ENV === "production" ? "db" : process.env.DB_HOST;

const pool = new Pool({
    user: process.env.DB_USER,
    host: dbHost,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

pool.query("SELECT NOW()", (error, res) => {
    if (error) console.error("Database connection error:", error);
    else console.log("Database connected successfully");
});

export default pool;
