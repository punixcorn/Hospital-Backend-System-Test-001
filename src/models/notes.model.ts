// src/models/note.model.ts
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
	{
		doctor_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		patient_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		original_note: { type: String, required: true },
		extracted_actions: {
			actionable_steps: {
				checklist: { type: String, required: true },
				plan: { type: String, required: true },
				number_of_days: { type: Number, required: true },
				interval_between_days: { type: Number, required: true },
			},
		},
		number_of_days_left: { type: Number, required: true },
		date_of_creation: { type: Date, default: Date.now },
		is_done: { type: Boolean, default: false },
		remind_patient_today: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
