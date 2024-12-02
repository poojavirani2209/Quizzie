import request from "supertest";
import app from "../../app";
import { getQuiz } from "../../quiz-service/quiz.model";
import { getQuestion } from "../../quiz-service/question.model";
import { addAnswer } from "../../quiz-service/answer.model";
import {
  addQuizScoreForUser,
  getResult,
} from "../../result-service/result.model";
import {
  Answer,
  AnswerSummary,
  Question,
  Quiz,
} from "../../quiz-service/quiz.types";
import { User } from "../../auth-service/auth.types";

let adminUser: User = {
  id: 1,
  username: "adminUser",
  password: "adminPassword",
  role_id: 1,
};
jest.mock(`../../quiz-service/question.model`);
jest.mock(`../../quiz-service/quiz.model`);
jest.mock(`../../quiz-service/answer.model`);
jest.mock(`../../result-service/result.model`);

jest.mock("jwt-simple", () => ({
  decode: () => {
    return adminUser;
  },
}));
jest.mock("../../auth-service/auth.model", () => ({
  checkPermission: () => {
    return true;
  }, // Mock the checkPermission function
}));

let quiz: Quiz = {
  id: 1,
  title: "Quiz 1",
  questions: [1],
};

let question: Question = {
  id: 1,
  text: "What is 2+2",
  options: ["4", "5", "3", "2"],
  correctOption: 0,
};

let answer: Answer = {
  id: 1,
  questionId: 1,
  selectedOption: 0,
  isCorrectAnswer: false,
};

let actualAnswerSummary: AnswerSummary = {
  correctOption: 0,
  isCorrectAnswer: true,
  questionId: 1,
  selectedOption: 0,
};

describe("Submit answers", () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });
  //quizId not provided - 400
  test("Given invalid quizId, when submitting answers for a quiz, it should return error for required request data.", async () => {
    const response = await request(app)
      .post("/result/submit-answers")
      .set("Authorization", `Bearer dummyToken`)
      .send({ quizId: undefined, answers: [] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Quiz and Answers for questions, for submitting answers.`
    );
  });
  // answers not provided i.e. length 0
  test("Given answers are not provided, when submitting answers for a quiz, it should return error for required request data.", async () => {
    const response = await request(app)
      .post("/result/submit-answers")
      .set("Authorization", `Bearer dummyToken`)
      .send({ quizId: 1, answers: [] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Quiz and Answers for questions, for submitting answers.`
    );
  });
  // answers is not array
  test("Given answers is not in proper format, when submitting answers for a quiz, it should return error for required request data.", async () => {
    const response = await request(app)
      .post("/result/submit-answers")
      .set("Authorization", `Bearer dummyToken`)
      .send({ quizId: 1, answers: undefined });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Quiz and Answers for questions, for submitting answers.`
    );
  });
  // error getting quiz - 404
  test("Given error occurred while getting quiz, when submitting answers for a quiz, it should return internal server error", async () => {
    (getQuiz as jest.Mock).mockImplementation(() => {
      throw new Error(`Error occurred while getting quiz.`);
    });

    const response = await request(app)
      .post("/result/submit-answers")
      .set("Authorization", `Bearer dummyToken`)
      .send({
        quizId: 1,
        answers: [
          {
            questionId: 1,
            selectedOption: 1,
          },
        ],
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Error occurred while getting quiz.`);
  });
  // error getting question - 404
  test("Given error occurred while getting question for a quiz, when submitting answers for a quiz, it should return internal server error", async () => {
    (getQuiz as jest.Mock).mockResolvedValue(quiz);
    (getQuestion as jest.Mock).mockImplementation(() => {
      throw new Error(`Error occurred while getting question.`);
    });

    const response = await request(app)
      .post("/result/submit-answers")
      .set("Authorization", `Bearer dummyToken`)
      .send({
        quizId: 1,
        answers: [
          {
            questionId: 1,
            selectedOption: 1,
          },
        ],
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while getting question.`
    );
  });

  // error adding answer
  test("Given error occurred while adding answers for quiz, when submitting answers for a quiz, it should return internal server error", async () => {
    (getQuiz as jest.Mock).mockResolvedValue(quiz);
    (getQuestion as jest.Mock).mockResolvedValue(question);
    (addAnswer as jest.Mock).mockImplementation(() => {
      throw new Error(`Error occurred while adding answer.`);
    });

    const response = await request(app)
      .post("/result/submit-answers")
      .set("Authorization", `Bearer dummyToken`)
      .send({
        quizId: 1,
        answers: [
          {
            questionId: 1,
            selectedOption: 1,
          },
        ],
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Error occurred while adding answer.`);
  });
  // error updating result
  test("Given error occurred while updating quiz score, when submitting answers for a quiz, it should return internal server error", async () => {
    (getQuiz as jest.Mock).mockResolvedValue(quiz);
    (getQuestion as jest.Mock).mockResolvedValue(question);
    (addAnswer as jest.Mock).mockResolvedValue(answer);
    (addQuizScoreForUser as jest.Mock).mockImplementation(() => {
      throw new Error(`Error occurred while updating quiz score.`);
    });

    const response = await request(app)
      .post("/result/submit-answers")
      .set("Authorization", `Bearer dummyToken`)
      .send({
        quizId: 1,
        answers: [
          {
            questionId: 1,
            selectedOption: 1,
          },
        ],
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while updating quiz score.`
    );
  });
  // proper submit - 200, score and actual sumaary
  test("Given answers were submitted, when submitting answers for a quiz, it should return score and summary", async () => {
    (getQuiz as jest.Mock).mockResolvedValue(quiz);
    (getQuestion as jest.Mock).mockResolvedValue(question);
    (addAnswer as jest.Mock).mockResolvedValue(answer);
    (addQuizScoreForUser as jest.Mock).mockResolvedValue(1);

    const response = await request(app)
      .post("/result/submit-answers")
      .set("Authorization", `Bearer dummyToken`)
      .send({
        quizId: 1,
        answers: [
          {
            questionId: 1,
            selectedOption: 0,
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(1);
    expect(response.body.actualAnswersSummary[0]).toMatchObject(
      actualAnswerSummary
    );
  });
});

describe("Get Quiz results", () => {
  //quizId not provided - 400
  test("Given no quiz details, when getting result for logged in user for a quiz, it should return error for required request data.", async () => {
    const response = await request(app)
      .get("/result/quizId/undefined")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- QuizId , for getting result for user.`
    );
  });
  // error getting result - 500
  test("Given database error occurs, when getting result for logged in user for a quiz, it should return internal server error.", async () => {
    (getResult as jest.Mock).mockImplementation(() => {
      throw new Error(`Error occurred while getting result for user`);
    });
    const response = await request(app)
      .get("/result/quizId/1")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while getting result for user`
    );
  });
  // result not found
  test("Given result for a quiz was not found, when getting result for logged in user for a quiz, it should return internal server error.", async () => {
    (getResult as jest.Mock).mockImplementation(() => {
      throw new Error(`result not found`);
    });
    const response = await request(app)
      .get("/result/quizId/1")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`result not found`);
  });
  // proper result - 200, score and actual sumaary
  test("Given valid quizId, when getting result for loggin user for a quiz, it should return score and result in response.", async () => {
    (getResult as jest.Mock).mockResolvedValue({
      score: 1,
      actualAnswersSummary: [actualAnswerSummary],
    });

    const response = await request(app)
      .get("/result/quizId/1")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(200);
  });
});
