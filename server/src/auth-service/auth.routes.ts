import { Router } from "express";
import * as authController from "./auth.controller";

/** Express Router specifically for auth (login/register) service endpoints */
const authRouter = Router();

authRouter.post(`/login`, authController.login);
authRouter.post(`/register`, authController.registerLearnerUser);
authRouter.post(`/admin/register`, authController.registerAdminUser);

export default authRouter;
