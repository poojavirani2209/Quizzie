import { AnswerSummary, SubmittedAnswer } from "../quiz-service/quiz.types";
import { User } from "../auth-service/auth.types";
import { getQuiz } from "../quiz-service/quiz.model";
import { addQuizScoreForUser, getResult as getResults } from "./result.model";
import { getQuestion } from "../quiz-service/question.model";
import { addAnswer } from "../quiz-service/answer.model";

export async function submitQuizAnswers(
  quizId: number,
  answers: Array<SubmittedAnswer>,
  user: User
) {
  try {
    let quiz = await getQuiz(quizId);
    let actualAnswersSummary: Array<AnswerSummary> = [];
    let score = 0;
    for await (let ans of answers) {
      if (quiz.questions.includes(ans.questionId)) {
        let question = await getQuestion(ans.questionId);
        let isCorrectAnswer = ans.selectedOption == question.correctOption;
        actualAnswersSummary.push({
          correctOption: question.correctOption,
          isCorrectAnswer,
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
        });
        if (isCorrectAnswer) {
          score++;
        }
        await addAnswer(ans, isCorrectAnswer);
      }
      await addQuizScoreForUser(user.id, quizId, score, actualAnswersSummary);
      return { score, actualAnswersSummary };
    }
  } catch (error: any) {
    throw error;
  }
}

export async function getQuizResultForUser(quizId: number, userId: number) {
  try {
    let results = await getResults(quizId, userId);
    return results;
  } catch (error) {
    throw error;
  }
}
