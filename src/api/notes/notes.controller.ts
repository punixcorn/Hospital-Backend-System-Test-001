// src/api/notes/notes.controller.ts
import { Request, Response } from "express";
import { addNoteTask, getMyTasks } from "./notes.service.js";

/**
 * Creates a new note task.
 * Expects in the request body: patientId and originalNote.
 * Only doctors can access this endpoint.
 * @throws {LogicError} If the user is not a doctor.
 * @throws {LogicError} If either patientId or originalNote is missing.
 * @throws {Error} If there is a problem creating the note task.
 */
export const addNoteTaskController = async (req: Request, res: Response) => {
	try {
		// Ensure the authenticated user is a doctor.
		const doctorId = req.user._id;
		if (req.user.role !== true) {
			res.status(403).json({
				error: "Only doctors can create note tasks",
			});
		}

		const { patientId, originalNote } = req.body;
		if (!patientId || !originalNote) {
			res.status(400).json({
				error: "patientId and originalNote are required",
			});
		}

		const note = await addNoteTask(doctorId, patientId, originalNote);
		res.status(201).json({ note });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

/**
 * Controller for patients to retrieve their active tasks.
 * Only patients can access this endpoint.
 */
export const getMyTasksController = async (req: Request, res: Response) => {
	try {
		// Ensure the authenticated user is a patient.
		const patientId = req.user._id;
		if (req.user.role !== false) {
			res.status(403).json({ error: "Only patients can view tasks" });
		}

		const tasks = await getMyTasks(patientId);
		res.status(200).json({ tasks });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};
