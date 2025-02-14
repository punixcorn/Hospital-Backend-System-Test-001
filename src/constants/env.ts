/**
 * Returns the value of the environment variable with the given key,
 * or the defaultValue if the variable is not set.
 *
 * @param key The key of the environment variable to retrieve.
 * @param defaultValue The value to return if the variable is not set.
 * @throws An error if the variable is not set and no default is provided.
 */
const getEnv = (key: string, defaultValue?: string): string => {
	const return_value = process.env[key] || defaultValue;

	if (return_value === undefined || return_value === "") {
		throw new Error(`failed to get process enviroment key ${key}`);
	}
	return return_value;
};

export const MONGO_DATABASE_URI: string = getEnv("MONGO_URI");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "4004");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const GEMINI_API_KEY = getEnv("GEMINI_API");
