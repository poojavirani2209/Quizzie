import { NewQuiz, QuizQuestion } from "./quiz.types";
import { addNewQuiz, getAllQuiz, getQuiz } from "./quiz.model";
import { getQuestion } from "./question.model";

/**
 * Service to create a new quiz, by calling the db instance and querying the appropriate quizzes table.
 * @param title
 * @param questions
 * @returns
 */
export async function createNewQuiz(title: string, questions: Array<number>) {
  return new Promise(async (res, rej) => {
    try {
      let newQuiz: NewQuiz = {
        title,
        questions,
      };
      let quiz = await addNewQuiz(newQuiz);
      res(quiz);
    } catch (error: any) {
      console.log(`Error occurred while creating a new quiz:${error}`);
      rej(error);
    }
  });
}

/**
 * Service to fetch all quizzes, by calling the db instance and querying the appropriate quiz table.
 * @param
 * @returns
 */
export async function fetchAllQuizzes() {
  return new Promise(async (res, rej) => {
    try {
      let quizzes = await getAllQuiz();
      res(quizzes);
    } catch (error: any) {
      console.log(`Error occurred while fetching all the quizzes:${error}`);
      rej(error);
    }
  });
}

/**
 * Service to fetch quiz by id, by calling the db instance and querying the appropriate quiz table.
 * @param questionId
 * @returns
 */
export async function fetchQuizById(quizId: number) {
  return new Promise(async (res, rej) => {
    try {
      let quiz = await getQuiz(quizId);
      console.log("Quiz:" + quiz.questions);
      let questions: Array<QuizQuestion> = [];
      for await (let questionId of quiz.questions) {
        let question = await getQuestion(questionId);
        questions.push({
          id: question.id,
          text: question.text,
          options: question.options,
        });
      }
      res({ ...quiz, questions });
    } catch (error: any) {
      console.log(`Error occured while fetching quiz by id:${error}`);
      rej(error);
    }
  });
}
