import express from "express";
import bodyParser, { json } from "body-parser";
import "dotenv/config";
import connectDatabase from "./config/db.js";
import { APP_ORIGIN, PORT } from "./constants/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "./middleware/error.middleware.js";
import { handleControllerErrors } from "./utils/handleControllerErrors.js";
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_OK } from "./constants/httpCode.js";
import authRoutes from "./api/auth/auth.routes.js";
import doctorRoutes from "./api/doctor/doctor.routes.js";
import patientRoutes from "./api/patient/patient.routes.js";
import { extractActionableSteps } from "./utils/gemini.js";
// import notesRoutes from './api/notes/notes.routes';

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: APP_ORIGIN,
		credentials: true,
	}),
);
app.use(cookieParser());

// Extend Express Request type to include a user property.
declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

app.get(
	"/LLM",
	handleControllerErrors(async (req, res, next) => {
		const doctorNote =
			"Take the medicine every other day for the next 10 days. Purchase the medicine at the pharmacy and apply ice to the affected area twice a day for 5 days.";
		const data = await extractActionableSteps(doctorNote);
		const check: any = data as any;

		if (check.error === undefined) {
			res.status(HTTP_OK).json(data);
		} else {
			res.status(HTTP_INTERNAL_SERVER_ERROR).json(data);
		}
	}),
);

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
// app.use('/api/notes', notesRoutes);

app.use(errorHandlerMiddleware);
//app.use(authenticate);
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	connectDatabase();
});
