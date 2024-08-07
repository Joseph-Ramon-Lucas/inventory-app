import express, {
	type Express,
	type Request,
	type Response,
	json,
} from "express";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { tokenTable, usersTable } from "./db/schema";
import {
	errorResponse,
	successResponse,
	successResponseBody,
	userCredentialSchema,
	type RequestResult,
	type UserCredentials,
} from "./types";
import { isValid, z } from "zod";
import { checkUserInDb } from "./utils";
import { uuid } from "drizzle-orm/pg-core";
import { CookieOptions } from "express";
import cookieParser from "cookie-parser";
// salts for password
const saltRounds = 10;

const app: Express = express();
const port = 3000;

//make every route public
app.use(express.static("public"));
//parse req.body in json
app.use(json());
// parse the cookies
app.use(cookieParser());

function verifyCredentialLength(inputData: UserCredentials): RequestResult {
	const parseResult = userCredentialSchema.safeParse(inputData);
	if (!parseResult.success) {
		// console.log(parseResult, "this is the parse result");
		return errorResponse("Incorrect inputs when logging in");
	}
	return successResponse();
}

app.get("/api/", (req: Request, res: Response) => {
	console.log("oi");

	return res.status(200).json({ welcomeText: "Welcome to the Inventory App" });
});
//user authentication
app.post("/api/account/register", async (req: Request, res: Response) => {
	// check if body is empty
	console.log("HERE IS THE REQ BODY", req.body);

	// check if user input meets requirement
	const inputData: UserCredentials = req.body;
	const verifyCheck = verifyCredentialLength(inputData);

	if (!verifyCheck.success) {
		return res
			.status(400)
			.json(
				errorResponse(
					"Usernames must be between 3-25 char, and passwords 8-30 char",
				),
			);
	}

	console.log("reqbody:", req.body);

	const salt = bcrypt.genSaltSync(saltRounds);
	const hashWord = bcrypt.hashSync(inputData.password, saltRounds);

	console.log("hash", hashWord);

	try {
		// check if this user already exists
		const lookupResults = await checkUserInDb(inputData).catch((e) => {
			console.error("issue fetching user from db", e);
			return res.status(500).json(e);
		});

		console.log(lookupResults, "LOOKUP");

		// determine it's an array to use length method
		if (Array.isArray(lookupResults) && lookupResults.length > 0) {
			return res
				.status(400)
				.json(
					errorResponse(`Username ${inputData.username} is already in use`),
				);
		}

		// store new user
		const insertResults = await db
			.insert(usersTable)
			.values({ username: inputData.username, password: hashWord })
			.returning({ userId: usersTable.userId })
			.catch((err) => {
				console.error(err);
				return res.status(500).json(errorResponse(err));
			});

		return res.status(201).json(successResponseBody(insertResults));
	} catch (e) {
		console.error(e);
		res.status(500).json(e);
		return;
	}
});

app.post("/api/account/login", async (req: Request, res: Response) => {
	// reject empty bodies
	if (Object.values(req.body).length < 1) {
		return res
			.status(400)
			.json(errorResponse("Cannot login with empty request body"));
	}

	const inputData: UserCredentials = req.body;
	const verifyCheck = verifyCredentialLength(inputData);

	if (!verifyCheck.success) {
		return res
			.status(400)
			.json(
				errorResponse(
					"Usernames must be between 3-25 char, and passwords 8-30 char",
				),
			);
	}

	// check if username exists
	try {
		const lookupResults = await checkUserInDb(inputData).catch((e) => {
			console.error("issue fetching user from db", e);
			return res.status(500).json(e);
		});
		// console.log("LOOKYP:", lookupResults);

		// if username doesn't exist
		if (Array.isArray(lookupResults) && lookupResults.length < 1) {
			return res
				.status(400)
				.json(errorResponse(`Username, ${inputData.username} doesn't exist!`));
		}
		if (Array.isArray(lookupResults) && lookupResults.length > 0) {
			console.log("selection results=", lookupResults);
			const storedPassword: string = lookupResults[0].password;
			// compare hash & password
			const match = await bcrypt.compare(inputData.password, storedPassword);
			// wrong password --> don't tell them that for security

			if (!match) {
				return res
					.status(400)
					.json(errorResponse("Incorrect Username or Password"));
			}
			// remove token if they already have it -- cookies don't work with thunderclient
			const userToken = req.cookies.token;

			if (userToken) {
				console.log("USERTOKEN", userToken);

				const deletedRow = await db
					.delete(tokenTable)
					.where(eq(tokenTable.tokenId, userToken))
					.returning();

				console.log("DELTED TOKEN ROW", deletedRow);
			}

			// authenticate user
			// make new token
			const freshToken = await db
				.insert(tokenTable)
				.values({
					userId: lookupResults[0].userId,
				})
				.returning({ freshToken: tokenTable.tokenId })
				.catch((e) => {
					console.error("issue fetching user from db", e);
					return res.status(500).json(e);
				});
			return res.status(200).cookie("token", freshToken).send(freshToken);
		}
	} catch (e) {
		console.error("internal error:", e);

		res.status(500).json(e);
		return;
	}
});

// reauthenticate when logged in
app.post("/api/auth", async (req: Request, res: Response) => {});

app.get("/search", (req: Request, res: Response) => {
	const q = JSON.stringify(req.query.something);

	console.log(q);

	res.status(200);
	res.send(`searching for ${q}`);
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
