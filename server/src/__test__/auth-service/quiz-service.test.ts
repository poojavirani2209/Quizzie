import request from "supertest";
import app from "../../app";
import { addNewQuiz, getAllQuiz, getQuiz } from "../../quiz-service/quiz.model";
import { User } from "../../auth-service/auth.types";
import { getQuestion } from "../../quiz-service/question.model";

let adminUser: User = {
  id: 1,
  username: "adminUser",
  password: "adminPassword",
  role_id: 1,
};
jest.mock(`../../quiz-service/quiz.model`);
jest.mock(`../../quiz-service/question.model`);

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

describe("Create new quiz", () => {
  // title not provided - 400
  test("Given a quiz without title, when creating a new quiz, it should return error for required request data.", async () => {
    let emptyQuizText = {
      title: "",
      questions: [],
    };

    const response = await request(app)
      .post("/quiz")
      .set("Authorization", `Bearer dummyToken`)
      .send(emptyQuizText);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Quiz title and Questions, for creating a quiz`
    );
  });

  // questions empty array - 400
  test("Given a quiz with empty questions array, when creating a new quiz, it should return error for required request data.", async () => {
    let emptyQuestionsArray = {
      title: "",
      questions: [],
    };

    const response = await request(app)
      .post("/quiz")
      .set("Authorization", `Bearer dummyToken`)
      .send(emptyQuestionsArray);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Quiz title and Questions, for creating a quiz`
    );
  });

  // db error adding new quiz - 500
  test("Given database error occurrs, when creating a new quiz, it should return error for internal server error", async () => {
    (addNewQuiz as jest.Mock).mockImplementation(() => {
      throw new Error(`Error occurred while adding new quiz.`);
    });

    const response = await request(app)
      .post("/quiz")
      .set("Authorization", `Bearer dummyToken`)
      .send({
        title: "Quiz1",
        questions: [1, 2, 3],
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(`Error occurred while adding new quiz.`);
  });

  // succ - 200
  test("Given a valid quiz, when creating a new quiz, it should create it successfully", async () => {
    (addNewQuiz as jest.Mock).mockResolvedValue({
      title: "Quiz1",
      options: [1, 2, 3],
    });

    const response = await request(app)
      .post("/quiz")
      .set("Authorization", `Bearer dummyToken`)
      .send({
        title: "Quiz1",
        questions: [1, 2, 3],
      });

    expect(response.status).toBe(201);
  });
});

describe("Get all Quizzes", () => {
  // quiz not found - 404
  test("Given no quizzes were found, when getting all quizzes, it should specify no quizzes were found", async () => {
    (getAllQuiz as jest.Mock).mockRejectedValue({
      statusCode: 404,
      message: "Quiz not found",
    });

    const response = await request(app)
      .get("/quiz")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Quiz not found`);
  });
  // db error getting quiz - 500
  test("Given database error occurrs, when getting all quizzes, it should specify no quizzes were found", async () => {
    (getAllQuiz as jest.Mock).mockImplementationOnce(() => {
      throw new Error(`Error occurred while fetching quizzes from database`);
    });

    const response = await request(app)
      .get("/quiz")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while fetching quizzes from database`
    );
  });
  // emoty array of quizzes - 200
  test("Given no quiz exist, when getting all questions, it should specify return empty array", async () => {
    (getAllQuiz as jest.Mock).mockResolvedValue([]);

    const response = await request(app)
      .get("/quiz")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(200);
  });
  // succ - 200
  test("Given quizzes exist, when getting all questions, it should return quiz array.", async () => {
    (getAllQuiz as jest.Mock).mockResolvedValue([
      {
        text: "What is 2 + 2?",
        options: ["4", "3", "5", "6"],
        correctOption: 0,
      },
    ]);

    const response = await request(app)
      .get("/quiz")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(200);
  });
});
describe("Get Quiz by Id", () => {
  // quizId not provided - 400
  test("Given quiz Id not provided, when fetching quiz by id, it should return error for required request data.", async () => {
    const response = await request(app)
      .get("/quiz/null")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- QuizId, for fetching quiz details`
    );
  });
  // quiz not found by id - 404
  test("Given invalid quiz Id, when fetching quiz by id, it should return error specifying quiz was not found.", async () => {
    (getQuiz as jest.Mock).mockRejectedValue({
      statusCode: 404,
      message: "Quiz not found",
    });

    const response = await request(app)
      .get("/quiz/2")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Quiz not found");
  });
  // db error getting quiz - 500
  test("Given database error occured, when fetching quiz by id, it should return internal server error", async () => {
    (getQuiz as jest.Mock).mockImplementationOnce(() => {
      throw new Error(`Error occurred while fetching quiz by id`);
    });

    const response = await request(app)
      .get("/quiz/1")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while fetching quiz by id`
    );
  });
  // succ - 200
  test("Given valid quizId, when fetching quiz by id, it should return  quiz in response", async () => {
    (getQuiz as jest.Mock).mockResolvedValue({
      id: 0,
      title: "Quiz1",
      questions: [1],
    });
    (getQuestion as jest.Mock).mockResolvedValue({
      id: 1,
      text: "What is 2 + 2?",
      options: ["4", "3", "5", "6"],
      correctOption: 0,
    });

    const response = await request(app)
      .get("/quiz/1")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(200);
  });
});
