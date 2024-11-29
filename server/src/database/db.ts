import sqlite3 from "sqlite3";

let db: sqlite3.Database;

/** Creates an inmemory SQLITE embedded database */
export function createInMemoryDB() {
  db = new sqlite3.Database(":memory:");
}

/** Ensures to return same db instance wherever called. */
export function getDB() {
  if (!db) {
    /** creates the db instance if not already created, before sending the response */
    createInMemoryDB();
  }
  return db;
}
