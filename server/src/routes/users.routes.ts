import { Router } from "express";
import { User } from "../models/User";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error: any) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const user = await User.getUserById(Number(req.params.id));
        res.json(user);
    } catch (error: any) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const user = await User.createUser(first_name, last_name, email, password);
        res.status(201).json(user);
    } catch (error: any) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { first_name, last_name, email } = req.body;
        const user = await User.updateUser(Number(req.params.id), first_name, last_name, email);
        res.json(user);
    } catch (error: any) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await User.deleteUser(Number(req.params.id));
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
});

export default router;
