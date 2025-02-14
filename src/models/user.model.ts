import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends mongoose.Document {
	email: string;
	password: string;
	verified: boolean;
	createdAt: Date;
	updatedAt: Date;
	role: boolean;
	comparePassword(password: string): Promise<boolean>;
	omitPassword(): Pick<
		UserDocument,
		"_id" | "email" | "verified" | "createdAt" | "updatedAt"
	>;
}

const userSchema = new mongoose.Schema<UserDocument>(
	{
		email: { type: String, unique: true, required: true },
		password: { type: String, unique: false, required: true },
		verified: { type: Boolean, required: true, default: false },
		role: { type: Boolean, required: true },
	},
	{
		timestamps: true,
	},
);

// a prehook when save is called
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 8);
	return next();
});

// a static method on the user model
// returns a bool
userSchema.methods.comparePassword = async function (password: string) {
	return bcrypt.compare(password, this.password).catch(() => false);
};

/**
 * Omits the password property from the user document.
 * @returns a new object with all properties except the password.
 */
userSchema.methods.omitPassword = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
