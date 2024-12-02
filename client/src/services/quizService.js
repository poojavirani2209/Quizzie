import axios from "axios";
import { getAuthToken } from "./authService";

const QUIZ_API_URL = "http://localhost:8887/quiz";
const QUESTION_API_URL = "http://localhost:8887/question";
const RESULT_API_URL = "http://localhost:8887/result";

export const getQuizzes = () => {
  return axios.get(`${QUIZ_API_URL}`, {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`, // Attach the token to the Authorization header
    },
  });
};

export const getQuestions = () => {
  return axios.get(`${QUESTION_API_URL}`, {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`, // Attach the token to the Authorization header
    },
  });
};

export const getQuizById = (quizId) => {
  return axios.get(`${QUIZ_API_URL}/${quizId}`, {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`, // Attach the token to the Authorization header
    },
  });
};

export const submitAnswer = (quizId, answers) => {
  return axios.post(
    `${RESULT_API_URL}/submit-answers`,
    {
      quizId,
      answers,
    },
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );
};

export const getResults = (quizId) => {
  return axios.get(`${RESULT_API_URL}/quizId/${quizId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

export const createQuiz = (quiz) => {
  return axios.post(`${QUIZ_API_URL}`, quiz, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

export const createQuestion = (question) => {
  return axios.post(`${QUESTION_API_URL}`, question, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};
