import { getDB } from "../database/db";
import { Answer, SubmittedAnswer } from "./quiz.types";

/**
 * Creates answers table with schema:
 * id: identifier for a questions row
 * question_id: answer for specific question - Foreign key with questions table
 * selected_option: option selected by the user while answering for question
 * is_correct: specifies boolean if the selected_option was correct or not
 */
export function createAnswersTable() {
  const db = getDB();
  db.run(`CREATE TABLE answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER,
    selected_option INTEGER,
    is_correct BOOLEAN,
    FOREIGN KEY (question_id) REFERENCES questions(id)
  );
  `);
}

/** Adds an answer given by current logged in user for a question, in answers table. */
export async function addAnswer(
  submittedAnswer: SubmittedAnswer,
  isCorrectAnswer: boolean
): Promise<Answer> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get(
      "Insert into answers ( question_id,selected_option,is_correct) VALUES (?, ?, ?)",
      [
        submittedAnswer.questionId,
        submittedAnswer.selectedOption,
        isCorrectAnswer,
      ],
      (err, answer) => {
        if (err) {
          rej(`Error adding a new answer: ${err}`);
        } else {
          res(answer as Answer);
        }
      }
    );
  });
}

/** Used to get answer given by user with QuestionId. */
export async function getAnswerByQuestionId(
  questionId: number
): Promise<Answer> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get(
      "Select * FROM answers WHERE question_id = ?",
      [questionId],
      (err, answer) => {
        if (err) {
          rej(`Error getting a answer: ${err}`);
        } else {
          if (!answer) {
            rej({ statusCode: 404, message: "Answer not found" });
          }
          res(answer as Answer);
        }
      }
    );
  });
}
