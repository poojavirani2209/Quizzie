/** Types used for ensuring that overall model for each artifact is consistent, if not then give error at compile time it self.  */

import { AnswerSummary } from "../quiz-service/quiz.types";

export interface Result {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  answers: Array<AnswerSummary>;
}
