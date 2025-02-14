import { RequestHandler } from "express";
import { HTTP_UNAUTHORIZED } from "../constants/httpCode.js";
import { LogicError } from "../utils/logicError.js";
import { SessionModel } from "../models/session.models.js";
import { verifyToken } from "../utils/jwt.js";
import { handleControllerErrors } from "../utils/handleControllerErrors.js";
import { userInfo } from "os";
import UserModel from "../models/user.model.js";

const authenticate: RequestHandler = handleControllerErrors(
	async (req, res, next) => {
		const accessToken = req.cookies.accessToken as string | undefined;
		if (!accessToken) {
			throw new LogicError(HTTP_UNAUTHORIZED, "Not authorized");
		}
		const { error, payload } = verifyToken(accessToken);

		if (error) {
			const error_message: string =
				error === "jwt expired" ? "Token expired" : "Invalid token";
			throw new LogicError(HTTP_UNAUTHORIZED, error);
		}
		console.log("in middleware");
		console.log(payload.sessionId);
		console.log(payload.userId);
		// Await the asynchronous database query
		const session = await SessionModel.findById(payload.sessionId);
		if (!session) {
			throw new LogicError(HTTP_UNAUTHORIZED, "Session not found");
		}

		// Assign the userId from the session to req.user
		req.user = await UserModel.findById(payload.userId);
		next();
	},
);

export default authenticate;
