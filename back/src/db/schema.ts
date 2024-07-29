import { uuid } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { serial, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	userId: serial("userid").primaryKey(),
	username: text("username").notNull(),
	password: text("password").notNull(),
});

export const tokenTable = pgTable("tokens", {
	sessionId: uuid("sessionid").primaryKey().defaultRandom(),
	userId: integer("userid").references(() => usersTable.userId),
});
