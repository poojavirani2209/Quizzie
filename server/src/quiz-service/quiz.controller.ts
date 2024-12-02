import { Request, Response } from "express";
import { createNewQuiz, fetchAllQuizzes, fetchQuizById } from "./quiz.service";

/**
 * Controller which gets request of fetching all quizzes.
 * @param request
 * @param response
 */
export async function getAllQuizzes(request: Request, response: Response) {
  try {
    const fetchAllQuizzesResponse = await fetchAllQuizzes();
    response.status(200).json(fetchAllQuizzesResponse);
  } catch (error: any) {
    console.log(`Error occurred while fetching quiz list:${error}`);
    response
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal Server error` });
  }
}

/**
 * Controller which gets request of fetching question by id.
 * It ensures that the request body has valid inputs before sending to service.
 * @param request
 * @param response
 */
export async function getQuizById(request: Request, response: Response) {
  try {
    const quizId = request.params.id;
    if (!quizId || quizId == "null" || quizId == "undefined") {
      response.status(400).json({
        message: "Provide required details- QuizId, for fetching quiz details",
      });
    } else {
      const fetchQuizResponse = await fetchQuizById(
        quizId as unknown as number
      );
      response.status(200).json(fetchQuizResponse);
    }
  } catch (error: any) {
    console.log(`Error occurred while fetching quiz by id:${error}`);
    response
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal Server error` });
  }
}

/**
 * Controller which gets request of creating a quiz.
 * It ensures that the request body has valid inputs before sending to service.
 * @param request
 * @param response
 */
export async function createQuiz(request: Request, response: Response) {
  try {
    const { title, questions } = request.body;
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      response.status(400).json({
        message:
          "Provide required details- Quiz title and Questions, for creating a quiz",
      });
    } else {
      const createQuestionResponse = await createNewQuiz(title, questions);
      response.status(201).send(createQuestionResponse);
    }
  } catch (error: any) {
    console.log(`Error occurred while creating a new quiz:${error}`);
    response
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal Server error` });
  }
}
