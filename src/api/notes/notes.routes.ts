// src/api/notes/notes.routes.ts
import { Router } from "express";
import {
	addNoteTaskController,
	getMyTasksController,
} from "./notes.controller.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

// All endpoints in this router require authentication.
router.use(authenticate);

// For doctors to create a note task.
router.post("/add_note_task", addNoteTaskController);

// For patients to get their active (not done) tasks.
router.get("/get_my_tasks", getMyTasksController);

export default router;
