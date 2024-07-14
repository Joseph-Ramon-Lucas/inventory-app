import { z } from "zod";

export const userCredentials = z.object({
	username: z.string().min(1).max(25),
	password: z.string().min(1).max(30),
});

const validUserCredentials = (inputs: unknown) => {
	const isValidData = userCredentials.parse(inputs);
	return isValidData;
};
