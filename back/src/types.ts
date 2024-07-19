import { z } from "zod";

export const userCredentialSchema = z.object({
	username: z.string().min(3).max(25),
	password: z.string().min(8).max(30),
});

export type UserCredentials = z.infer<typeof userCredentialSchema>;

export type errorMessage = string;

export type SuccessResult = { success: true };
export type ErrorResult = { success: false; errorMessage: string };
export type RequestResult = SuccessResult | ErrorResult;

export function successResponse(): SuccessResult {
	return { success: true };
}

export function errorResponse(errorReason: string): ErrorResult {
	return { success: false, errorMessage: errorReason };
}
