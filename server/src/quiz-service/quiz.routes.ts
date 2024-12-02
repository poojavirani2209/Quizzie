import { Router } from "express";
import * as quizController from "./quiz.controller";
import {
  authorizePermission,
  verifyToken,
} from "../auth-service/auth.middleware";
import { Permissions } from "../auth-service/auth.types";

/** Router specifically for quiz service endpoints, with middle ware for verifying token and autohrizing user for performing operation in request. */
const quizRouter = Router();

quizRouter.post(
  `/`,
  verifyToken,
  authorizePermission(Permissions.CREATE_QUIZ),
  quizController.createQuiz
);
quizRouter.get(`/`, verifyToken, quizController.getAllQuizzes);
quizRouter.get(`/:id`, verifyToken, quizController.getQuizById);

export default quizRouter;
