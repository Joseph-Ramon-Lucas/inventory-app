import { promise, type z } from "zod";
import { errorResponse, type ErrorResult, type UserCredentials } from "./types";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { usersTable } from "./db/schema";

// if parsing fails, will return a list of string error messages
export function parseError(zodError: z.ZodError): string[] {
	// extract form and field errors
	const { formErrors, fieldErrors } = zodError.flatten();
	// return a list
	return [
		// expand all from formErrors
		...formErrors,
		// expand and map all field errors to strings
		...Object.entries(fieldErrors).map(
			([property, message]) => `"${property}": ${message}`,
		),
	];
}

// // Timer Promise
// export async function PromiseTime(ms: number): Promise<void> {
//     const new Promise<void>((resolve, reject) =>
//         await setTimeout(ms))
// }

export async function checkUserInDb(
	inputData: UserCredentials,
): Promise<
	{ userId: number; username: string; password: string }[] | ErrorResult
> {
	const lookupResults = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, inputData.username))
		.limit(1)
		.catch((e) => {
			return errorResponse(e);
		});
	return lookupResults;
}
