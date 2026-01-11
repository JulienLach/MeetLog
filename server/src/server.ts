import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import notesRouter from "./routes/notes.routes";
import recordsRouter from "./routes/records.routes";
import usersRouter from "./routes/users.routes";
// Initialize audio processor worker
import "./workers/audioProcessor.worker.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT_BACKEND = parseInt(process.env.PORT_BACKEND || "3001");
const ORIGIN_URL = process.env.ORIGIN_URL;
const SERVER_URL = process.env.SERVER_URL;

const app = express();

app.use(express.json());
app.use(cors({ origin: ORIGIN_URL }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/users", usersRouter);
app.use("/api/records", recordsRouter);
app.use("/api/notes", notesRouter);

app.listen(PORT_BACKEND, () => {
    console.log(`Server is running on ${SERVER_URL}`);
});
