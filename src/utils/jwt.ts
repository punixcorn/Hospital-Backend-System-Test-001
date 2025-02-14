import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";
import { UserDocument } from "../models/user.model.js";
import { SessionDocument } from "../models/session.models.js";

export type RefreshTokenPayload = {
	sessionId: SessionDocument["_id"];
};

export type AccessTokenPayload = {
	userId: UserDocument["_id"];
	sessionId: SessionDocument["_id"];
};

type SignOptionsAndSecret = SignOptions & {
	secret: string;
};

const defaults: SignOptions = {};

const accessTokenSignOptions: SignOptionsAndSecret = {
	expiresIn: "15m",
	secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
	expiresIn: "30d",
	secret: JWT_REFRESH_SECRET,
};

/**
 * Signs a JWT token with the given payload and options.
 *
 * @param payload - The payload to include in the token. This can be either
 *                  an AccessTokenPayload or RefreshTokenPayload.
 * @param options - Optional signing options including the secret key. If not
 *                  provided, default access token sign options are used.
 * @returns The signed JWT token as a string.
 */

export const signToken = (
	payload: AccessTokenPayload | RefreshTokenPayload,
	options?: SignOptionsAndSecret,
) => {
	const { secret, ...signOpts } = options || accessTokenSignOptions;
	return jwt.sign(payload, secret, {
		...defaults,
		...signOpts,
	});
};

/**
 * Verifies a JWT token with the given options.
 *
 * @param token - The JWT token to verify.
 * @param options - Optional verification options including the secret key.
 *                  If not provided, default access token verify options are used.
 * @returns An object with a `payload` property if the token is valid, or an
 *          `error` property if the token is invalid.
 */
export const verifyToken = <TPayload extends object = AccessTokenPayload>(
	token: string,
	options?: VerifyOptions & {
		secret?: string;
	},
) => {
	const { secret = JWT_SECRET, ...verifyOpts } = options || {};
	try {
		const payload = jwt.verify(token, secret, {
			...defaults,
			...verifyOpts,
		}) as TPayload;
		return {
			payload,
		};
	} catch (error: any) {
		return {
			error: error.message,
		};
	}
};
