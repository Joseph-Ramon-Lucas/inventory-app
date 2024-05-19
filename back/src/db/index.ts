import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dbEnv from "../../env.json";
import * as schema from "./schema";

const client = new Pool(dbEnv);

export const db = drizzle(client, {
    schema,
});
