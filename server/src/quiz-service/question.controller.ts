import { Request, Response } from "express";
import {
  createNewQuestion,
  fetchAllQuestions,
  fetchQuestionById,
} from "./question.service";

/**
 * Controller which gets request of creating a question.
 * It ensures that the request body has valid inputs before sending to service.
 * @param request
 * @param response
 */
export async function createQuestion(request: Request, response: Response) {
  try {
    const { text, options, correctOption } = request.body;
    if (
      !text ||
      !Array.isArray(options) ||
      options.length === 0 ||
      correctOption === undefined
    ) {
      response.status(400).json({
        message:
          "Provide required details- Question text, options, and correct answer for creating a question",
      });
    } else {
      if (options.length != 4) {
        response.status(400).json({
          message:
            "Number of options is limited to 4. Please provide exactly 4 options.",
        });
      } else {
        const createQuestionResponse = await createNewQuestion(
          text,
          options,
          correctOption
        );
        response.status(201).json(createQuestionResponse);
      }
    }
  } catch (error: any) {
    response
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal Server error` });
  }
}

/**
 * Controller which gets request of getting all the questions created till now.
 * @param request
 * @param response
 */
export async function getAllQuestions(request: Request, response: Response) {
  try {
    const fetchAllQuestionsResponse = await fetchAllQuestions();
    response.status(200).json(fetchAllQuestionsResponse);
  } catch (error: any) {
    console.log(error);
    response
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal Server error` });
  }
}

/**
 * Controller which gets request of getting a question with specific id
 * It ensures that the request body has valid inputs- questionId, before sending to service.
 * @param request
 * @param response
 */
export async function getQuestionById(request: Request, response: Response) {
  try {
    const questionId = request.params.id;
    if (!questionId || questionId == "null" || questionId == "undefined") {
      response.status(400).json({
        message:
          "Provide required details- Question id, for fetching question details",
      });
    } else {
      const fetchQuizResponse = await fetchQuestionById(
        questionId as unknown as number
      );
      response.status(200).json(fetchQuizResponse);
    }
  } catch (error: any) {
    response
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal Server error` });
  }
}
