/*
 * Handle the logic controller for the auth service
 */
import { Request, Response } from "express";
import { createUser, loginUser } from "./auth.service.js";
import { handleControllerErrors } from "../../utils/handleControllerErrors.js";
import { loginSchema, signupSchema } from "./auth.schema.js";
import {
	HTTP_CREATED,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
} from "../../constants/httpCode.js";
import { clearAuthCookies, setAuthCookies } from "../../utils/cookies.js";
import { verifyToken } from "../../utils/jwt.js";
import { SessionModel } from "../../models/session.models.js";
import { LogicError } from "../../utils/logicError.js";
import { refreshUserAccessToken } from "./auth.service.js";
import {
	getRefreshTokenCookieOptions,
	getAccessTokenCookieOptions,
} from "../../utils/cookies.js";
/**
 *
 * Handle user sign up
 * will use jwt tokens to maintain connection
 */

export const signupHandler = handleControllerErrors(
	async (req: Request, res: Response) => {
		// validate request to check if any of the passed in arguments are useable
		const request = signupSchema.parse({
			...req.body,
			userAgent: req.headers["user-agent"],
		});

		// call createuser service to create a user
		const { user, accessToken, refreshToken } = await createUser(request);

		// set cookie on response and  send response
		setAuthCookies({ res, accessToken, refreshToken })
			.status(HTTP_CREATED)
			.json({
				user,
			});
	},
);

export const loginHandler = handleControllerErrors(
	async (req: Request, res: Response) => {
		const request = loginSchema.parse({
			...req.body,
			UserAgent: req.headers["user-agent"],
		});

		const { user, accessToken, refreshToken } = await loginUser(request);

		setAuthCookies({ res, accessToken, refreshToken })
			.status(HTTP_OK)
			.json({
				user,
				message: "Login Sucessful",
			});
	},
);

export const logOutHandler = handleControllerErrors(
	async (req: Request, res: Response) => {
		const accessToken = req.cookies.accessToken as string | undefined;
		const { payload } = verifyToken(accessToken || "");

		if (payload) {
			// remove session from db
			await SessionModel.findByIdAndDelete(payload.sessionId);
		}

		// clear cookies
		return clearAuthCookies(res)
			.status(HTTP_OK)
			.json({ message: "Logout successful" });
	},
);

export const refreshHandler = handleControllerErrors(async (req, res) => {
	const refreshToken = req.cookies.refreshToken as string | undefined;
	if (!refreshToken) {
		throw new LogicError(HTTP_UNAUTHORIZED, "Missing refresh token");
	}

	const { accessToken, newRefreshToken } = await refreshUserAccessToken(
		refreshToken,
	);
	if (newRefreshToken) {
		res.cookie(
			"refreshToken",
			newRefreshToken,
			getRefreshTokenCookieOptions(),
		);
	}
	return res
		.status(HTTP_OK)
		.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
		.json({ message: "Access token refreshed" });
});
