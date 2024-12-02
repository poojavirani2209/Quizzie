/** Types used for ensuring that overall model for each artifact is consistent, if not then give error at compile time it self.  */

export interface Question extends NewQuestion {
  id: number;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: Array<string>;
}

export interface NewQuestion {
  text: string;
  options: Array<string>;
  correctOption: number;
}

export interface Quiz extends NewQuiz {
  id: number;
}

export interface NewQuiz {
  title: string;
  questions: Array<number>;
}

export interface SubmittedAnswer {
  questionId: number;
  selectedOption: number;
}

export interface Answer extends SubmittedAnswer {
  id: number;
  questionId: number;
  selectedOption: number;
  isCorrectAnswer: boolean;
}

export interface AnswerSummary extends SubmittedAnswer {
  correctOption: number;
  isCorrectAnswer: boolean;
}
