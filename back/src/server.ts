import express, { Express, Request, Response, json } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import {Pool} from "pg";


const saltRounds = 10;

dotenv.config({ path: "../configs/.env" });

const app: Express = express();
const port = process.env.PORT || 3000;

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
    const hash = bcrypt.hashSync(password, saltRounds);

    console.log("hash", hash);


    
    res.status(201).send(username+" registered!");
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
