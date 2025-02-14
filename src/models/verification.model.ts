import mongoose from "mongoose";

export const enum VerificationCodeType {
	EmailVerification = "email_verification",
	PasswordReset = "password_reset",
}

export interface verificationCodeDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	type: VerificationCodeType;
	expiresAt: Date;
	createdAt: Date;
}

export const verificationCodeSchema =
	new mongoose.Schema<verificationCodeDocument>({
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		type: { type: String, required: true },
		createdAt: { type: Date, required: true, default: Date.now },
		expiresAt: { type: Date, required: true },
	});

export const verificationCodeModel = mongoose.model<verificationCodeDocument>(
	"verificationCode",
	verificationCodeSchema,
	"verification_codes",
);
