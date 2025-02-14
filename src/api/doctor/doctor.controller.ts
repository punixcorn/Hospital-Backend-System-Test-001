import { Request, Response } from "express";
import { fetchPatientsForDoctor } from "./doctor.service.js";
import { handleControllerErrors } from "../../utils/handleControllerErrors.js";
import { LogicError } from "../../utils/logicError.js";
import { HTTP_UNAUTHORIZED } from "../../constants/httpCode.js";
/// get all patients under the doctor
export const getPatients = handleControllerErrors(
	async (req: Request, res: Response) => {
		// req.user is populated by our authentication middleware
		console.log(req.user.role);
		if (req.user.role != true) {
			throw new LogicError(HTTP_UNAUTHORIZED, "Your'e not a doctor");
		}
		const doctorId = req.user._id;
		const patients = await fetchPatientsForDoctor(doctorId);
		res.status(200).json({ patients });
	},
);
