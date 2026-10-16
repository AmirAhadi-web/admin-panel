import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Starter-template Drizzle schema.
 *
 * The Panelo dashboard UI currently uses an isolated browser-backed sample
 * repository. This table keeps the starter infrastructure and health check
 * operational; replace or extend it when the primary database adapter is
 * implemented.
 */
export const exampleNotes = pgTable("example_notes", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
