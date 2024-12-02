import sqlite3 from "sqlite3";
import {
  addRoles,
  createPermissionTable,
  createRolePermissionTable,
  createRoleTable,
  createUserTable,
} from "../auth-service/auth.model";
import { createQuizTable } from "../quiz-service/quiz.model";
import { createResultsTable } from "../result-service/result.model";
import { createQuestionsTable } from "../quiz-service/question.model";
import { createAnswersTable } from "../quiz-service/answer.model";

let db: sqlite3.Database;

/** Creates an inmemory SQLITE embedded database */
export function createInMemoryDB() {
  db = new sqlite3.Database(":memory:");
}

/** Ensures to return same db instance wherever called. This is like singleton pattern, where other instance is not sent when using.
 * But as we are using an inmemory database, the sqlite3 package already does that for us
 */
export function getDB() {
  if (!db) {
    /** creates the db instance if not already created, before sending the response */
    createInMemoryDB();
  }
  return db;
}

/** Initializes all the tables required for Quizzie */
export function setupTables() {
  db.serialize(() => {
    createUserTable();
    createRoleTable();
    createPermissionTable();
    createRolePermissionTable();
    addRoles();
    createQuizTable();
    createQuestionsTable();
    createAnswersTable();
    createResultsTable();
  });
}
