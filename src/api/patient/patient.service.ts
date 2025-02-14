// src/patient/patient.service.ts
import UserModel from "../../models/user.model.js";
import Assignment from "../../models/assignment.model.js";

/**
 * Returns a list of available doctors.
 * Doctors are users with role === true.
 */
export const getAvailableDoctors = async () => {
	// Adjust the projection as needed (e.g., include name, email, etc.)
	const doctors = await UserModel.find({ role: true }, "_id email name");
	return doctors;
};

/**
 * Assigns a patient to a doctor.
 * If an assignment document exists for the doctor, the patient ID is added to the patients array (using $addToSet to avoid duplicates).
 * If not, a new assignment document is created.
 * @param patientId - the ID of the patient
 * @param doctorId - the chosen doctor's ID
 */
export const selectDoctor = async (patientId: string, doctorId: string) => {
	// Ensure the chosen doctor exists and has a doctor role
	const doctor = await UserModel.findOne({ _id: doctorId, role: true });
	if (!doctor) {
		throw new Error("Doctor not found or invalid");
	}

	// Update (or create) the assignment document for the doctor:
	const assignment = await Assignment.findOneAndUpdate(
		{ doctor: doctorId },
		{ $addToSet: { patients: patientId } },
		{ new: true, upsert: true },
	);
	return assignment;
};
