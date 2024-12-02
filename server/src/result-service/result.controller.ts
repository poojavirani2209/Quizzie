import { Request, Response } from "express";
import { getQuizResultForUser, submitQuizAnswers } from "./result.service";
import { User } from "../auth-service/auth.types";

export async function submitAnswers(request: Request, response: Response) {
  try {
    const { quizId, answers } = request.body;
    if (!quizId || !Array.isArray(answers) || answers.length === 0) {
      response.status(400).json({
        message:
          "Provide required details- Quiz and Answers for questions, for submitting answers.",
      });
    } else {
      const user = request.body.user;
      const submitAnswerResponse = await submitQuizAnswers(
        quizId,
        answers,
        user
      );
      response.status(200).json(submitAnswerResponse);
    }
  } catch (error: any) {
    response
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal Server error` });
  }
}

export async function getQuizResults(request: Request, response: Response) {
  try {
    const quizId = request.params.quizId;
    if (!quizId || quizId == "null" || quizId == "undefined") {
      response.status(400).json({
        message:
          "Provide required details- QuizId , for getting result for user.",
      });
    } else {
      const user: User = request.body.user;
      const resultResponse = await getQuizResultForUser(
        quizId as unknown as number,
        user.id
      );
      response.status(200).json(resultResponse);
    }
  } catch (error: any) {
    response
      .status(error.statusCode || 500)
      .json({ message: error.message || `Internal Server error` });
  }
}
