import { Request, Response, NextFunction } from "express";

export type AsyncController = (
	req: Request,
	res: Response,
	next: NextFunction,
) => Promise<any>;

/**
 * A higher-order function that wraps an asynchronous controller function
 * to handle errors. If the controller throws an error, it passes the error
 * to the next middleware in the stack, which is typically an error handler.
 *
 * @param controller - The asynchronous controller to be wrapped.
 * @returns A new async function that wraps the controller with error handling.
 */

export const handleControllerErrors =
	(controller: AsyncController): AsyncController =>
	async (req, res, next) => {
		try {
			await controller(req, res, next);
		} catch (err) {
			next(err);
		}
	};
