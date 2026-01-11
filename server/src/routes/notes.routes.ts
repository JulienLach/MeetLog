import { Router } from "express";
import { Note } from "../models/Note";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        //TODO: will be changed with proper authentication
        const { record_id, user_id } = req.query;
        const notes = record_id
            ? await Note.getNotesByRecordId(Number(record_id))
            : user_id
            ? await Note.getAllNotes(Number(user_id))
            : await Note.getAllNotes();
        res.json(notes);
    } catch (error: any) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const note = await Note.getNoteById(Number(req.params.id));
        res.json(note);
    } catch (error: any) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { id_record, id_user, content } = req.body;
        const note = await Note.createNote(id_record, id_user, content);
        res.status(201).json(note);
    } catch (error: any) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { content } = req.body;
        if (!content) {
            res.status(400).json({ error: "Content is required" });
            return;
        }
        const note = await Note.updateNote(Number(req.params.id), content);
        res.json(note);
    } catch (error: any) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await Note.deleteNote(Number(req.params.id));
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
});

export default router;
