import { NewQuestion } from "./quiz.types";
import { addNewQuestion, getAllQuestion, getQuestion } from "./question.model";

/**
 * Service to fetch question by id, by calling the db instance and querying the appropriate question table.
 * @param questionId
 * @returns
 */
export async function fetchQuestionById(questionId: number) {
  return new Promise(async (res, rej) => {
    try {
      let question = await getQuestion(questionId);
      res(question);
    } catch (error: any) {
      console.log(`Error occurred while fetching question by id:${error}`);
      rej(error);
    }
  });
}

/**
 * Service to fetch all question, by calling the db instance and querying the appropriate question table.
 * @param
 * @returns
 */
export async function fetchAllQuestions() {
  return new Promise(async (res, rej) => {
    try {
      let questions = await getAllQuestion();
      res(questions);
    } catch (error: any) {
      console.log(`Error occurred while fetching all questions:${error}`);
      rej(error);
    }
  });
}

/**
 * Service to create a new question, by calling the db instance and querying the appropriate question table.
 * @param text
 * @param options
 * @param correctOptionIndex
 * @returns
 */
export async function createNewQuestion(
  text: string,
  options: Array<string>,
  correctOptionIndex: number
) {
  return new Promise(async (res, rej) => {
    try {
      let newQuestion: NewQuestion = {
        text,
        options,
        correctOption: correctOptionIndex,
      };
      let question = await addNewQuestion(newQuestion);
      res(question);
    } catch (error: any) {
      console.log(`Error occurred while creating a new question:${error}`);
      rej(error);
    }
  });
}
