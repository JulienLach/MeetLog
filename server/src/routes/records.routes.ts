import express from "express";
import multer from "multer";
import path from "path";
import { Record } from "../models/Record";
import { queueAudioProcessing } from "../workers/audioProcessor.worker";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.get("/", async (req, res, next) => {
    try {
        const { user_id, status } = req.query;
        const records = user_id
            ? await Record.getRecordsByUserId(Number(user_id))
            : status
            ? await Record.getRecordsByStatus(String(status))
            : await Record.getAllRecords();
        res.status(200).json(records);
    } catch (error: any) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const record = await Record.getRecordById(id);
        res.status(200).json(record);
    } catch (error: any) {
        next(error);
    }
});

router.get("/:id/status", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const record = await Record.getRecordById(id);
        res.status(200).json({
            id: record?.id_record,
            status: record?.status,
            error_message: record?.error_message || null,
            has_transcription: !!record?.transcription,
        });
    } catch (error: any) {
        next(error);
    }
});

router.post("/", upload.single("audio"), async (req, res, next) => {
    try {
        const { id_user, title, duration } = req.body;
        const file = req.file;

        if (!id_user || !title || !file) {
            res.status(400).json({ error: "Missing required fields or file" });
            return;
        }

        const record = await Record.createRecord(
            Number(id_user),
            title,
            Number(duration) || 0,
            `/uploads/${file.filename}`,
            file.size
        );
        await queueAudioProcessing(record.id_record);
        res.status(201).json(record);
    } catch (error: any) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { title, duration, status } = req.body;
        const record = status
            ? await Record.updateRecordStatus(id, status)
            : await Record.updateRecord(id, title, duration);
        res.status(200).json(record);
    } catch (error: any) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await Record.deleteRecord(id);
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
});

export default router;
