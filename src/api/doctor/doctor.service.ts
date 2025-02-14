import { HTTP_NOT_FOUND } from "../../constants/httpCode.js";
import Assignment from "../../models/assignment.model.js";
import User from "../../models/user.model.js";
import { LogicError } from "../../utils/logicError.js";

export const fetchPatientsForDoctor = async (doctorId: string) => {
	// Find the assignment document for the given doctor
	const assignment = await Assignment.findOne({ doctor: doctorId });
	if (!assignment) {
		throw new LogicError(
			HTTP_NOT_FOUND,
			"No assignment found for this doctor",
		);
	}

	// Fetch patient details from the User collection using the patient IDs
	const patients = await User.find(
		{ _id: { $in: assignment.patients } },
		"_id email createdAt updatedAt",
	);

	return patients;
};
