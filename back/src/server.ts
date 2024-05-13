import express, { Express, Request, Response, json } from "express";
import bcrypt from "bcrypt";

import {Pool} from "pg";
import dbEnv from "../env.json";

// let dbEnv = dotenv.config({ path: "../env.json" });
let db = new Pool(dbEnv)


// salts for password
const saltRounds = 10;

const app: Express = express();
const port = 3000;

//make every route public
app.use(express.static("public"));

//parse req.body in json
app.use(json());


app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Inventory App");
});

//user authentication
app.post("/register", (req: Request, res:Response) => {
    let {username, password} = req.body;
    console.log('reqbody:', req.body);

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashWord = bcrypt.hashSync(password, saltRounds);

    console.log("hash", hashWord);

    // check if this user already exists
    try {
        db.query(
            `SELECT username FROM users WHERE username = $1`, [username]
        )
        .then((result) => {
            let dbResult = result.rows;

            // can't use an existing username
            if (dbResult.includes(username)) {
                res.status(400).send(`Username ${username} is already in use`)
            }
        })
        .catch((err) => {
            res.status(500).send(err);
            return
        })
    }
    catch(e:any){
        console.error(e);
        res.status(500)
        return
    }


    // store new user
    db.query(
        `INSERT INTO users(username, password) VALUES($1, $2)`, [username, hashWord]
    )
    .then((result) => {
        let dbResult = JSON.stringify(result.rows)
        console.log(dbResult);
        res.status(200).send(dbResult)
    })
    .catch((error) => {
        console.error(JSON.stringify(error));
        res.status(500).json({error: error});
        return
    })




    
    // res.status(201).send(username+" registered!");
})


app.get("/search", (req:Request, res:Response) => {
    let q = JSON.stringify(req.query.something);

    console.log(q)
    
    res.status(200);
    res.send(`searching for ${q}`)
    
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
