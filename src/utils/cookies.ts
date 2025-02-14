import { CookieOptions, Response } from "express";
import { fifteenMinutes, oneMonth } from "./date.js";

const defaults: CookieOptions = {
	sameSite: "strict",
	httpOnly: true,
	// secure: true,
};

/**
 * Returns cookie options for the access token.
 * The access token is used to authenticate a user on each request.
 * It is short-lived and is refreshed automatically by the /auth/refresh endpoint.
 * @returns {CookieOptions} The cookie options for the access token.
 */
export const getAccessTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: fifteenMinutes(),
});

/**
 * Returns cookie options for the refresh token.
 * The refresh token is used to obtain a new access token once the existing one has expired.
 * It is long-lived and is only used to obtain a new access token.
 * @returns {CookieOptions} The cookie options for the refresh token.
 */
export const getRefreshTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: oneMonth(),
	path: "/auth/refresh", // help with security
});

export type seAuthCookiesParams = {
	res: Response;
	accessToken: string;
	refreshToken: string;
};

/**
 * This function will set the default cookie options defined above
 * and add expiry times to it
 * Then set it to the response passed in
 * and return the response to be used
 * @param param0 response
 */
export const setAuthCookies = ({
	res,
	accessToken,
	refreshToken,
}: seAuthCookiesParams): Response<any, Record<string, any>> => {
	return res
		.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
		.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

/**
 * Clears the authentication cookies from the response.
 * This includes the access token and refresh token cookies.
 * The refresh token cookie is cleared specifically at the path "/auth/refresh".
 *
 * @param res - The Express response object from which the cookies will be cleared.
 */

export const clearAuthCookies = (res: Response) =>
	res
		.clearCookie("accessToken")
		.clearCookie("refreshToken", { path: "/auth/refresh" });
