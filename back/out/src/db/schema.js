"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pg_core_2 = require("drizzle-orm/pg-core");
exports.usersTable = (0, pg_core_2.pgTable)("users", {
    userId: (0, pg_core_1.serial)("userId").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull(),
    password: (0, pg_core_1.text)("password"),
});
