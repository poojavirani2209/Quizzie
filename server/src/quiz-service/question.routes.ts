import { Router } from "express";
import * as questionController from "./question.controller";
import {
  authorizePermission,
  verifyToken,
} from "../auth-service/auth.middleware";
import { Permissions } from "../auth-service/auth.types";

/** Router specifically for question service endpoints, with middle ware for verifying token in request. */
const questionRouter = Router();

questionRouter.post(
  `/`,
  verifyToken,
  authorizePermission(Permissions.CREATE_QUESTION),
  questionController.createQuestion
);

questionRouter.get(`/`, verifyToken, questionController.getAllQuestions);

questionRouter.get(`/:id`, verifyToken, questionController.getQuestionById);

export default questionRouter;
