import express, {
	type Express,
	type Request,
	type Response,
	json,
} from "express";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { usersTable } from "./db/schema";
import { userCredentials } from "./types";
import { isValid } from "zod";
// salts for password
const saltRounds = 10;

const app: Express = express();
const port = 3000;

//make every route public
app.use(express.static("public"));
//parse req.body in json
app.use(json());

app.get("/api/", (req: Request, res: Response) => {
	console.log("oi");

	return res.status(200).json({ welcomeText: "Welcome to the Inventory App" });
});
//user authentication
app.post("/api/account/register", async (req: Request, res: Response) => {
	// check if body is empty
	console.log("HERE IS THE REQ BODY", req.body);

	// if (Object.keys(req.body).length < 2) {
	// 	return res
	// 		.status(400)
	// 		.json({ error: "request body missing username and password fields" });
	// }

	const { username, password } = req.body;
	console.log("reqbody:", req.body);

	const salt = bcrypt.genSaltSync(saltRounds);
	const hashWord = bcrypt.hashSync(password, saltRounds);

	console.log("hash", hashWord);

	// check if this user already exists
	try {
		db.select()
			.from(usersTable)
			.where(eq(usersTable.username, username))
			.limit(1)
			.then((results) => {
				if (results.length > 0) {
					return res.status(400).send(`Username ${username} is already in use`);
				}
			})
			.catch((err) => {
				res.status(500).json(err);
				return;
			});
	} catch (e) {
		console.error(e);

		res.status(500).json(e);
		return;
	}

	// store new user
	try {
		await db
			.insert(usersTable)
			.values({ username: username, password: hashWord })
			.returning({ userId: usersTable.userId })
			.then((results) => {
				console.log(results);
				return res.status(201).json({ message: JSON.stringify(results) });
			})
			.catch((err) => {
				console.error(err);
				return res.status(500).json(err);
			});
	} catch (e) {
		console.error(e);

		return res.status(500).send(e);
	}
});

app.post("/api/account/login", async (req: Request, res: Response) => {
	// reject empty bodies
	if (Object.values(req.body).length < 1) {
		return res.status(400).send("Cannot login with empty request body");
	}

	const { username, password } = req.body;
	console.log("un & pw", username, password);

	// check if username exists
	try {
		await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.username, username))
			.limit(1)
			.then((results) => {
				// username doesn't exist
				if (results.length < 1) {
					return res.status(400).send(`Username, ${username} doesn't exist!`);
				}
				console.log("selection results=", results);

				// compare hash & password
				const match = bcrypt.compare(password, results[0].password);
			})
			.catch((err) => {
				res.status(500).json(err);
				return;
			});
	} catch (e) {
		console.error(e);

		res.status(500).json(e);
		return;
	}

	return res.status(200).send("it works!");
});

app.get("/search", (req: Request, res: Response) => {
	const q = JSON.stringify(req.query.something);

	console.log(q);

	res.status(200);
	res.send(`searching for ${q}`);
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
