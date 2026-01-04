import { Router } from "express";
import {
    createNote,
    deleteNote,
    getAllNotes,
    getNoteById,
    getNotesByRecordId,
    updateNote,
} from "../services/notes.services.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const { record_id, user_id } = req.query;
        let notes;

        if (record_id) {
            notes = await getNotesByRecordId(Number(record_id));
        } else if (user_id) {
            notes = await getAllNotes(Number(user_id));
        } else {
            notes = await getAllNotes();
        }

        res.status(200).json(notes);
    } catch (error: any) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const note = await getNoteById(Number(req.params.id));
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.status(200).json(note);
    } catch (error: any) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { id_record, id_user, content } = req.body;
        if (!id_record || !id_user || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const note = await createNote(id_record, id_user, content);
        res.status(201).json(note);
    } catch (error: any) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }
        const note = await updateNote(Number(req.params.id), content);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.status(200).json(note);
    } catch (error: any) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const deleted = await deleteNote(Number(req.params.id));
        if (!deleted) return res.status(404).json({ error: "Note not found" });
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
});

export default router;
