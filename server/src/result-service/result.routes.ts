import { Router } from "express";
import * as resultController from "./result.controller";
import {
  authorizePermission,
  verifyToken,
} from "../auth-service/auth.middleware";
import { Permissions } from "../auth-service/auth.types";

/** Router specifically for quiz service endpoints */
const resultRouter = Router();

resultRouter.post(
  `/submit-answers`,
  verifyToken,
  authorizePermission(Permissions.TAKE_QUIZ),
  resultController.submitAnswers
);

resultRouter.get(
  `/quizId/:quizId`,
  verifyToken,
  resultController.getQuizResults
);

export default resultRouter;
