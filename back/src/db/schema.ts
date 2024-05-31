import { serial, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	userId: serial("userid").primaryKey(),
	username: text("username").notNull(),
	password: text("password"),
});
