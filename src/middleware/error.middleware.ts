import { ErrorRequestHandler } from "express";
import {
	HTTP_BAD_REQUEST,
	HTTP_INTERNAL_SERVER_ERROR,
} from "../constants/httpCode.js";
import z from "zod";
import { LogicError } from "../utils/logicError.js";

const errorHandlerMiddleware: ErrorRequestHandler = (error, req, res, next) => {
	console.log(`PATH ${req.path}`, error);

	// handle zod errors
	if (error instanceof z.ZodError) {
		const errors = error.issues.map((err) => {
			message: err.message;
			path: err.path.join(".");
		});

		res.status(HTTP_BAD_REQUEST).json({
			message: error.message,
			errors,
		});
	}

	if (error instanceof LogicError) {
		res.status(error.statusCode).json({
			error: error.message,
		});
	}

	res.status(HTTP_INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandlerMiddleware;
