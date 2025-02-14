// src/api/notes/notes.service.ts
import Note from "../../models/notes.model.js";
import { LLMdata, extractActionableSteps } from "../../utils/gemini.js";
import { LogicError } from "../../utils/logicError.js";
import { HTTP_INTERNAL_SERVER_ERROR } from "../../constants/httpCode.js";

/**
 * Creates a new note task.
 * Processes the original note using the LLM function to extract actionable steps.
 * Initializes number_of_days_left to LLMdata.actionable_steps.number_of_days.
 * @param doctorId - the ID of the doctor creating the note
 * @param patientId - the ID of the patient for whom the note is created
 * @param originalNote - the text of the doctor's note
 * @returns the newly created note document
 */
export const addNoteTask = async (
	doctorId: string,
	patientId: string,
	originalNote: string,
) => {
	const llmData: any = await extractActionableSteps(originalNote);

	if (llmData.error !== undefined) {
		throw new LogicError(HTTP_INTERNAL_SERVER_ERROR, llmData.error);
	}

	// Create the note document.
	const newNote = new Note({
		doctor_id: doctorId,
		patient_id: patientId,
		original_note: originalNote,
		extracted_actions: llmData, // Stores the entire LLMdata object
		number_of_days_left: llmData.actionable_steps.number_of_days,
		is_done: false,
		remind_patient_today: false,
	});

	await newNote.save();
	return newNote;
};

/**
 * Retrieves all active tasks for a patient (notes with is_done === false).
 * @param patientId - the ID of the patient
 * @returns a list of active tasks for the patient, sorted by creation time (newest first)
 */
export const getMyTasks = async (patientId: string) => {
	const tasks = await Note.find({
		patient_id: patientId,
		is_done: false,
	}).sort({ createdAt: -1 });
	return tasks;
};
