import mongoose, { mongo } from "mongoose";
import { oneMonth } from "../utils/date.js";

export interface SessionDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	userAgent?: string;
	createdAt: Date;
	expiresAt: Date;
}

export const SessionSchema = new mongoose.Schema<SessionDocument>({
	userId: {
		ref: "User",
		type: mongoose.Schema.Types.ObjectId,
		index: true,
	},
	userAgent: { type: String },
	createdAt: { type: Date, required: true, default: Date.now },
	expiresAt: {
		type: Date,
		default: oneMonth(),
	},
});

export const SessionModel = mongoose.model<SessionDocument>(
	"Session",
	SessionSchema,
);
