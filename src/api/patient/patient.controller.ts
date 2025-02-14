// src/patient/patient.controller.ts
import { Request, Response } from "express";
import { getAvailableDoctors, selectDoctor } from "./patient.service.js";

/**
 * Controller to list available doctors.
 */
export const listAvailableDoctors = async (req: Request, res: Response) => {
	try {
		const doctors = await getAvailableDoctors();
		res.status(200).json({ doctors });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

/**
 * Controller to allow a patient to select a doctor.
 * The patient's ID comes from req.user (populated by authenticateUser middleware).
 */
export const chooseDoctor = async (req: Request, res: Response) => {
	try {
		// Ensure the logged-in user is a patient (role === false)
		const patientId = req.user._id;
		if (req.user.role !== false) {
			res.status(403).json({
				error: "Only patients can select a doctor",
			});
		}

		const { doctorId } = req.body;
		if (!doctorId) {
			res.status(400).json({ error: "doctorId is required" });
		}

		const assignment = await selectDoctor(patientId, doctorId);
		res.status(200).json({
			message: "Doctor selected successfully",
			assignment,
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};
