import axios from "axios";

const AUTH_URL = "http://localhost:8887/auth/";

/** Function to authenticate the user(admin/learner) and store token in localStorage */
export const login = (username, password) => {
  return axios
    .post(`${AUTH_URL}/login`, { username, password })
    .then((response) => {
      // Store the token and userInfo(role) in localStorage upon successful login
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    });
};

/** Function to create a new user based on role(learner, admin)*/
export const register = (username, password, role) => {
  if (role != "admin") {
    return axios.post(`${AUTH_URL}/register`, { username, password });
  }
  return axios.post(`${AUTH_URL}${role}/register`, { username, password });
};

/** Function to retrieve the current logged-in user (with token)*/
export const getCurrentUserData = () => {
  return JSON.parse(localStorage.getItem("user"));
};

/** Function to retrieve the JWT token from localStorage*/
export const getAuthToken = () => {
  const userData = getCurrentUserData();
  return userData ? userData.token : null;
};
