import { Router } from "express";
import { User } from "../models/User.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.getUserById(Number(req.params.id));
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const user = await User.createUser(first_name, last_name, email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        if (!first_name || !last_name || !email) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const user = await User.updateUser(Number(req.params.id), first_name, last_name, email);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deleted = await User.deleteUser(Number(req.params.id));
        if (!deleted) return res.status(404).json({ error: "User not found" });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;
