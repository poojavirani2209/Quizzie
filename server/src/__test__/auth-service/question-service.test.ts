import request from "supertest";
import app from "../../app";
import {
  addNewQuestion,
  getAllQuestion,
  getQuestion,
} from "../../quiz-service/question.model";
import { User } from "../../auth-service/auth.types";

let adminUser: User = {
  id: 1,
  username: "adminUser",
  password: "adminPassword",
  role_id: 1,
};
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
describe("Create a new question", () => {
  // text not provided - 400
  test("Given a question without text, when creating a new question, it should return error for required request data.", async () => {
    let emptyQuestionText = {
      text: undefined,
      options: ["4", "3", "5", "6"],
      correctOption: 0,
    };

    const response = await request(app)
      .post("/question")
      .set("Authorization", `Bearer dummyToken`)
      .send(emptyQuestionText);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Question text, options, and correct answer for creating a question`
    );
  });

  // options not array - 400
  test("Given a question with empty options array, when creating a new question, it should return error for required request data.", async () => {
    let emptyOptions = {
      text: "What is 2+2",
      options: [],
      correctOption: 0,
    };

    const response = await request(app)
      .post("/question")
      .set("Authorization", `Bearer dummyToken`)
      .send(emptyOptions);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Question text, options, and correct answer for creating a question`
    );
  });

  test("Given a question with no options array, when creating a new question, it should return error for required request data.", async () => {
    let noOptionsArray = {
      text: " What is 2+2",
      options: undefined,
      correctOption: 0,
    };

    const response = await request(app)
      .post("/question")
      .set("Authorization", `Bearer dummyToken`)
      .send(noOptionsArray);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Question text, options, and correct answer for creating a question`
    );
  });

  // corrctoption not provided - 400
  test("Given a question with no correct option, when creating a new question, it should return error for required request data.", async () => {
    let noCorrectOption = {
      text: "What is 2+2",
      options: ["4", "3", "5", "6"],
      correctOption: undefined,
    };

    const response = await request(app)
      .post("/question")
      .set("Authorization", `Bearer dummyToken`)
      .send(noCorrectOption);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Question text, options, and correct answer for creating a question`
    );
  });
  // options length is not 4 exactly - 400
  test("Given a question with more than 4 options, when creating a new question, it should return error for required request data.", async () => {
    let moreOptionsThan4 = {
      text: "What is 2+2",
      options: ["4", "3", "5", "6", "7"],
      correctOption: 0,
    };

    const response = await request(app)
      .post("/question")
      .set("Authorization", `Bearer dummyToken`)
      .send(moreOptionsThan4);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Number of options is limited to 4. Please provide exactly 4 options.`
    );
  });
  // db error adding new question - 500

  test("Given database error occurrs, when creating a new question, it should return error for internal server error", async () => {
    (addNewQuestion as jest.Mock).mockImplementation(() => {
      throw new Error(`Error occurred while adding new question.`);
    });

    const response = await request(app)
      .post("/question")
      .set("Authorization", `Bearer dummyToken`)
      .send({
        text: "What is 2 + 2?",
        options: ["4", "3", "5", "6"],
        correctOption: 0,
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while adding new question.`
    );
  });
  // succ - 200
  test("Given a valid question, when creating a new question, it should create it successfully", async () => {
    (addNewQuestion as jest.Mock).mockResolvedValue({
      text: "What is 2 + 2?",
      options: ["4", "3", "5", "6"],
      correctOption: 0,
    });

    const response = await request(app)
      .post("/question")
      .set("Authorization", `Bearer dummyToken`)
      .send({
        text: "What is 2 + 2?",
        options: ["4", "3", "5", "6"],
        correctOption: 0,
      });

    expect(response.status).toBe(201);
  });
});

describe("Get all questions", () => {
  // question not found - 404
  test("Given no questions were found, when getting all questions, it should specify no questions were found", async () => {
    (getAllQuestion as jest.Mock).mockRejectedValue({
      statusCode: 404,
      message: "Question not found",
    });

    const response = await request(app)
      .get("/question")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Question not found`);
  });
  // db error getting question - 500
  test("Given database error occurrs, when getting all questions, it should specify no questions were found", async () => {
    (getAllQuestion as jest.Mock).mockImplementationOnce(() => {
      throw new Error(`Error occurred while fetching questions from database`);
    });

    const response = await request(app)
      .get("/question")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while fetching questions from database`
    );
  });
  // emoty array of questions - 200
  // db error getting question - 500
  test("Given database error occurrs, when getting all questions, it should specify no questions were found", async () => {
    (getAllQuestion as jest.Mock).mockResolvedValue([]);

    const response = await request(app)
      .get("/question")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(200);
  });
  // succ - 200
  test("Given database error occurrs, when getting all questions, it should specify no questions were found", async () => {
    (getAllQuestion as jest.Mock).mockResolvedValue([
      {
        text: "What is 2 + 2?",
        options: ["4", "3", "5", "6"],
        correctOption: 0,
      },
    ]);

    const response = await request(app)
      .get("/question")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(200);
  });
});

describe("Get question by id", () => {
  // questionId not provided - 400
  test("Given question Id not provided, when fetching question by id, it should return error for required request data.", async () => {
    const response = await request(app)
      .get("/question/undefined")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Provide required details- Question id, for fetching question details`
    );
  });
  // question not found by id - 404
  test("Given invalid question Id, when fetching question by id, it should return error specifying question was not found.", async () => {
    (getQuestion as jest.Mock).mockRejectedValue({
      statusCode: 404,
      message: "Question not found",
    });

    const response = await request(app)
      .get("/question/2")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Question not found");
  });
  // db error getting question - 500
  test("Given database error occured, when fetching question by id, it should return internal server error", async () => {
    (getQuestion as jest.Mock).mockImplementationOnce(() => {
      throw new Error(`Error occurred while fetching question by id`);
    });

    const response = await request(app)
      .get("/question/1")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      `Error occurred while fetching question by id`
    );
  });
  // succ - 200
  test("Given valid questionId, when fetching question by id, it should return error for required request data.", async () => {
    (getQuestion as jest.Mock).mockResolvedValue({
      id: 1,
      text: "What is 2 + 2?",
      options: ["4", "3", "5", "6"],
      correctOption: 0,
    });

    const response = await request(app)
      .get("/question/1")
      .set("Authorization", `Bearer dummyToken`);

    expect(response.status).toBe(200);
  });
});
