import { Router } from "express";
import multer from "multer";
import path from "path";
import {
    createRecord,
    deleteRecord,
    getAllRecords,
    getRecordById,
    getRecordsByStatus,
    getRecordsByUserId,
    updateRecord,
    updateRecordStatus,
} from "../services/records.services.js";
import { queueAudioProcessing } from "../workers/audioProcessor.worker.js";

const router = Router();

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    try {
        const { user_id, status } = req.query;
        let records;

        if (user_id) {
            records = await getRecordsByUserId(Number(user_id));
        } else if (status) {
            records = await getRecordsByStatus(String(status));
        } else {
            records = await getAllRecords();
        }

        res.json(records);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch records" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const record = await getRecordById(Number(req.params.id));
        if (!record) return res.status(404).json({ error: "Record not found" });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch record" });
    }
});

router.get("/:id/status", async (req, res) => {
    try {
        const record = await getRecordById(Number(req.params.id));
        if (!record) {
            return res.status(404).json({ error: "Record not found" });
        }

        res.json({
            id: record.id_record,
            status: record.status,
            error_message: record.error_message || null,
            has_transcription: !!record.transcription,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch record status" });
    }
});

router.post("/", upload.single("audio"), async (req, res) => {
    try {
        const { id_user, title, duration } = req.body;
        const file = req.file;

        if (!id_user || !title || !file) {
            return res.status(400).json({ error: "Missing required fields or file" });
        }

        // L'URL du fichier sera accessible via le serveur
        const file_uri = `/uploads/${file.filename}`;
        const file_size = file.size;

        const record = await createRecord(Number(id_user), title, Number(duration) || 0, file_uri, file_size);

        // Queue audio processing job (asynchronous)
        await queueAudioProcessing(record.id_record);

        res.status(201).json(record);
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).json({ error: "Failed to create record" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, duration, status } = req.body;
        let record;

        if (status) {
            record = await updateRecordStatus(Number(req.params.id), status);
        } else {
            record = await updateRecord(Number(req.params.id), title, duration);
        }

        if (!record) return res.status(404).json({ error: "Record not found" });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: "Failed to update record" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deleted = await deleteRecord(Number(req.params.id));
        if (!deleted) return res.status(404).json({ error: "Record not found" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete record" });
    }
});

export default router;
