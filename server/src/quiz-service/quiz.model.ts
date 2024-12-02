import { getDB } from "../database/db";
import { NewQuiz, Quiz } from "./quiz.types";

/**
 * Creates quiz table with schema:
 * id: identifier for a quiz row
 * title: title for the quiz
 * questions: array of questionIds inside the quiz
 */
export function createQuizTable() {
  const db = getDB();
  db.run(`CREATE TABLE quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  questions TEXT 
);`);
}

/**
 * Adds a new quiz into quiz table
 * @param newQuiz
 * @returns
 */
export async function addNewQuiz(newQuiz: NewQuiz): Promise<Quiz> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get(
      "Insert into quizzes (title, questions) VALUES (?, ?)",
      [newQuiz.title, JSON.stringify(newQuiz.questions)],
      (err, quiz) => {
        if (err) {
          rej(`Error adding a new quiz: ${err}`);
        } else {
          res(quiz as Quiz);
        }
      }
    );
  });
}

/**
 * Retrieves all the quizzes from quiz table
 * @returns
 */
export async function getAllQuiz(): Promise<Array<Quiz>> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.all("Select * FROM quizzes", (err, quizzes) => {
      if (err) {
        rej(`Error getting a new quiz: ${err}`);
      } else {
        if (!quizzes) {
          rej({ statusCode: 404, message: "Quizzes not found" });
        }
        res(quizzes as Array<Quiz>);
      }
    });
  });
}

/**
 * Retrieves a quiz by id
 * @param quizId
 * @returns
 */
export async function getQuiz(quizId: number): Promise<Quiz> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get("Select * FROM quizzes WHERE id = ?", [quizId], (err, quiz) => {
      if (err) {
        rej(`Error getting a new quiz: ${err}`);
      } else {
        if (!quiz) {
          rej({ statusCode: 404, message: "Quiz not found" });
        }
        let existingQuiz: Quiz = {
          id: (quiz as Quiz).id,
          title: (quiz as Quiz).title,
          questions: JSON.parse(quiz["questions"]),
        };
        res(existingQuiz as Quiz);
      }
    });
  });
}
