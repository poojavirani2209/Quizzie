import { getDB } from "../database/db";
import { NewQuestion, Question } from "./quiz.types";

/**
 * Creates questions table with schema:
 * id: identifier for a questions row
 * text: the title of the question
 * options: multiple choice question with 4 options to select from
 * correct_option: specific the index of correct answer option. starts from 0
 */
export function createQuestionsTable() {
  const db = getDB();
  db.run(`CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL, 
    options TEXT NOT NULL, 
    correct_option INTEGER NOT NULL
  );`);
}

/**
 * Adds a new question in questions table
 * @param newQuestion
 * @returns
 */
export async function addNewQuestion(
  newQuestion: NewQuestion
): Promise<Question> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.get(
      "Insert into questions (text, options, correct_option) VALUES (?, ?, ?)",
      [
        newQuestion.text,
        JSON.stringify(newQuestion.options),
        newQuestion.correctOption,
      ],
      (err, question) => {
        if (err) {
          rej(`Error adding a new question: ${err}`);
        } else {
          res(question as Question);
        }
      }
    );
  });
}

/**
 * Retrives all the questions from questions table
 * @returns
 */
export async function getAllQuestion(): Promise<Array<Question>> {
  const db = getDB();
  return new Promise((res, rej) => {
    db.all("Select * FROM questions", (err, questions) => {
      if (err) {
        rej(`Error getting question: ${err}`);
      } else {
        if (!questions) {
          rej({ statusCode: 404, message: "Question not found" });
        } else {
          res(questions as Array<Question>);
        }
      }
    });
  });
}

/**
 * Retrieves a specific question by id from questions table
 * @param questionId
 * @returns
 */
export async function getQuestion(questionId: number): Promise<Question> {
  console.log(questionId);
  const db = getDB();
  return new Promise((res, rej) => {
    db.get(
      "Select * FROM questions WHERE id = ?",
      [questionId],
      (err, question) => {
        if (err) {
          rej(`Error getting a question: ${err}`);
        } else {
          if (!question) {
            rej({ statusCode: 404, message: "Question not found" });
          }
          //Done to parse options array
          let existingQuestion: Question = {
            id: (question as Question).id,
            text: (question as Question).text,
            options: JSON.parse(question["options"]),
            correctOption: (question as Question)["correct_option"],
          };
          res(existingQuestion as Question);
        }
      }
    );
  });
}
