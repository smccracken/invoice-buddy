import { pgTable, integer, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["open", "paid", "void", "overdue"]);

export const Invoices = pgTable("invoices", {
  id: serial("id").primaryKey().notNull(),
  amount: integer("amount").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  description: text("description"),
  status: statusEnum("status").notNull(),
});
