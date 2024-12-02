import { getDB } from "../database/db";
import { AnswerSummary, SubmittedAnswer } from "../quiz-service/quiz.types";
import { Result } from "./result.types";

export function createResultsTable() {
  const db = getDB();
  db.run(`CREATE TABLE results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  quiz_id INTEGER,
  score INTEGER,
  answers TEXT, 
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);`);
}

export async function addQuizScoreForUser(
  userId: number,
  quizId: number,
  score: number,
  answers: Array<AnswerSummary>
): Promise<number> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.run(
      "Insert INTO results (user_id, quiz_id, score, answers) VALUES (?, ?, ?, ?)",
      [userId, quizId, score, JSON.stringify(answers)],
      function (err) {
        if (err) {
          console.log(err)
          rej(`Error submitting quiz results:${err}`);
        }
        res(score);
      }
    );
  });
}

// Get the result of a quiz for a specific user
export async function getResult(quizId: number, userId: number) {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get(
      "SELECT * FROM results WHERE user_id = ? AND quiz_id = ?",
      [userId, quizId],
      (err, result) => {
        if (err) {
          rej("Error fetching result");
        }

        if (!result) {
          rej("Result not found");
        }

        res({
          score: (result as Result).score,
          answers: JSON.parse((result as any).answers), 
        });
      }
    );
  });
}
