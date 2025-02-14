import z from "zod";

export enum userRole {
	PATIENT = 0,
	DOCTOR = 1,
}

export const signupSchema = z
	.object({
		email: z.string().email().min(5).max(255),
		password: z.string().min(8).max(255),
		confirmPassword: z.string().min(8).max(255),
		userAgent: z.string().optional(),
		role: z.nativeEnum(userRole),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const loginSchema = z.object({
	email: z.string().email().min(5).max(255),
	password: z.string().min(8).max(255),
	userAgent: z.string().optional(),
	role: z.nativeEnum(userRole),
});

export type signupSchemaType = z.infer<typeof signupSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
