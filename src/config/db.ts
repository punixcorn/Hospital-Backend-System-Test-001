import mongoose from "mongoose";
import { MONGO_DATABASE_URI } from "../constants/env.js";

/**
 * Establishes a connection to the MongoDB database using the URI specified in the environment variables.
 * If the connection fails, logs the error and terminates the process.
 */

const connectDatabase = async () => {
	try {
		await mongoose.connect(MONGO_DATABASE_URI);
	} catch (e) {
		console.log(`Could not connect to mongoose database Error: {e}`);
		process.exit(1);
	}
};

export default connectDatabase;
