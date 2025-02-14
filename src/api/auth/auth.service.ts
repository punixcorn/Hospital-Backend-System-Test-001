import jwt from "jsonwebtoken";
import { loginSchemaType, signupSchemaType } from "./auth.schema.js";
import UserModel from "../../models/user.model.js";
import {
	verificationCodeModel,
	VerificationCodeType,
} from "../../models/verification.model.js";
import { oneMonth, sixMonths, ONE_DAY_MS } from "../../utils/date.js";
import { SessionModel } from "../../models/session.models.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../../constants/env.js";
import { LogicError } from "../../utils/logicError.js";
import { HTTP_CONFLICT, HTTP_UNAUTHORIZED } from "../../constants/httpCode.js";
import { refreshTokenSignOptions, signToken } from "../../utils/jwt.js";
import { verifyToken, RefreshTokenPayload } from "../../utils/jwt.js";

/**
 * Creates a new user account and generates authentication tokens.
 *
 * @param {Object} param0 - The user data.
 * @param {string} param0.email - The user's email address.
 * @param {string} param0.password - The user's password.
 * @param {string} param0.userAgent - The user agent string.
 * @param {boolean} param0.role - The user's role (true for doctor, false for patient).
 *
 * @throws {LogicError} - Throws an error if the user already exists.
 *
 * @returns {Promise<Object>} - Returns an object containing the created user (without password), access token, and refresh token.
 */

export const createUser = async ({
	email,
	password,
	userAgent,
	role,
}: signupSchemaType) => {
	// verify user doesn't exist
	const existingUser = await UserModel.exists({
		email: email,
	});

	if (existingUser) {
		throw new LogicError(HTTP_CONFLICT, "User already exists");
	}

	// create user
	const user = await UserModel.create({
		email: email,
		password: password,
		role: role,
	});

	// create verificatrion code
	const verificationCode = await verificationCodeModel.create({
		userId: user._id,
		type: VerificationCodeType.EmailVerification,
		expiresAt: sixMonths(),
	});

	// send verificatrion email

	// create session for 30days
	// referesh token willl be used to generate an acces token
	const session = await SessionModel.create({
		id: user._id,
		userAgent: userAgent,
	});

	// sign aceces token & referesh token
	const session_role: string = user.role ? "doctor" : "patient";

	const refreshToken = signToken(
		{
			sessionId: session._id,
		},
		refreshTokenSignOptions,
	);

	const accessToken = signToken({
		sessionId: session._id,
	}); // no need to use other styuff,deaults

	return {
		user: user.omitPassword(),
		accessToken,
		refreshToken,
	};
};

/**
 * Logs a user in and returns an access token and refresh token.
 *
 * @param {object} data - The data to log in with.
 * @param {string} data.email - The user's email.
 * @param {string} data.password - The user's password.
 * @param {string} data.userAgent - The user's user agent string.
 * @returns {object} - An object with the user's data, an access token and a refresh token.
 * @throws {LogicError} - If the user is not found, or the password is invalid.
 */
export const loginUser = async ({
	email,
	password,
	userAgent,
}: loginSchemaType) => {
	// get user
	const user = await UserModel.findOne({ email });
	if (!user) {
		throw new LogicError(HTTP_UNAUTHORIZED, "Invalid email or password");
	}

	// validate the passswork
	const isValid = await user.comparePassword(password);
	if (!isValid) {
		throw new LogicError(HTTP_UNAUTHORIZED, "Invalid email or password");
	}

	// create a session

	const userId = user._id;
	const role: string = user.role ? "doctor" : "patient";
	const session = await SessionModel.create({
		userId,
		userAgent,
	});

	console.log(session);

	// sign accees and referesh
	const refreshToken = jwt.sign(
		{
			sessionId: session._id,
		},
		JWT_REFRESH_SECRET,
		{
			audience: [role],
			expiresIn: "30d",
		},
	);

	const accessToken = jwt.sign(
		{
			userId: user._id,
			sessionId: session._id,
		},
		JWT_SECRET,
		{
			audience: [role],
			expiresIn: "15m",
		},
	);

	// return user and token
	return {
		user: user.omitPassword(),
		accessToken,
		refreshToken,
	};
};

/**
 * Refreshes the user's access token and returns a new access token
 * and optional new refresh token if the session needs to be refreshed.
 *
 * @param {string} refreshToken - The refresh token to use for refreshing the access token.
 *
 * @returns {Promise<{accessToken: string, newRefreshToken?: string}>}
 *          A promise resolving to an object with the new access token and
 *          an optional new refresh token if the session was refreshed.
 *
 * @throws {LogicError} - If the refresh token is invalid, or the session has expired.
 */
export const refreshUserAccessToken = async (refreshToken: string) => {
	const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
		secret: refreshTokenSignOptions.secret,
	});

	if (!payload) {
		throw new LogicError(HTTP_UNAUTHORIZED, "Invalid refresh token");
	}

	const session = await SessionModel.findById(payload.sessionId);
	const now = Date.now();
	if (session && session.expiresAt.getTime() > now) {
		throw new LogicError(HTTP_UNAUTHORIZED, "Session expired");
	}

	// refresh the session if it expires in the next 24hrs
	const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
	if (sessionNeedsRefresh) {
		session.expiresAt = oneMonth();
		await session.save();
	}

	const newRefreshToken = sessionNeedsRefresh
		? signToken(
				{
					sessionId: session._id,
				},
				refreshTokenSignOptions,
		  )
		: undefined;

	const accessToken = signToken({
		userId: session.userId,
		sessionId: session._id,
	});

	return {
		accessToken,
		newRefreshToken,
	};
};
