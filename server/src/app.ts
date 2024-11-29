import express from "express";
import { createInMemoryDB } from "./database/db";

let port = 8887;
let app = express();

/** Handles parsing json in request bodies */
app.use(express.json());

/**
 * Create a new localhost express server application listening on the port specified
 * Connects to DB on successful server app start.
 */
export const startExpressApp = async () => {
  app.listen(port, async () => {
    console.log(`Server has started and listening at port ${port}`);
    try {
      createInMemoryDB();
    } catch (error: any) {
      console.log(`Error occurred while connecting to database: ${error}`);
      throw error;// throws error to close the application, as without database the quiz application wont get its data.
    }
  });
};
export default app;
