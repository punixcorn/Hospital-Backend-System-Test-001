import { HttpStatusCode } from "../constants/httpCode.js";

export class LogicError extends Error {
	/**
	 * Constructs a new LogicError instance.
	 * @param statusCode - The HTTP status code associated with this error.
	 * @param message - A descriptive message explaining the error.
	 */

	constructor(public statusCode: HttpStatusCode, public message: string) {
		super(message);
	}
}
