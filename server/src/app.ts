import express from "express";
import { createInMemoryDB, setupTables } from "./database/db";
import authRouter from "./auth-service/auth.routes";
import quizRouter from "./quiz-service/quiz.routes";
import resultRouter from "./result-service/result.routes";
import questionRouter from "./quiz-service/question.routes";
import cors from 'cors';

let port = 8887;
let app = express();

/** Handles parsing json in request bodies */
app.use(express.json());
app.use(cors())

/** Endpoints for quiz application for different services*/
app.use("/auth", authRouter);
app.use("/quiz", quizRouter);
app.use("/question", questionRouter);
app.use("/result", resultRouter);

/**
 * Create a new localhost express server application listening on the port specified
 * Connects to DB on successful server app start.
 */
export const startExpressApp = async () => {
  app.listen(port, async () => {
    console.log(`Server has started and listening at port ${port}`);
    try {
      createInMemoryDB();
      setupTables();
    } catch (error: any) {
      console.log(`Error occurred while connecting to database: ${error}`);
      throw error; // throws error to close the application, as without database the quiz application wont get its data.
    }
  });
};
export default app;
