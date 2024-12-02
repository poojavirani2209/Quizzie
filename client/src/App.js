import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import QuizList from "./components/QuizList";
import PrivateRoute from "./components/Privateroute.js";
import CreateQuiz from "./components/CreateQuiz";
import { getCurrentUserData } from "./services/authService";
import Home from "./components/Home.js";
import Register from "./components/Register.js";
import CreateQuestion from "./components/CreateQuestion.js";
import QuizPage from "./components/QuizPage.js";

function App() {
  const user = getCurrentUserData();

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Learner Login and Register Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Login Register Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        {/* Quiz list route */}
        <Route
          path="/quizlist"
          element={<PrivateRoute element={<QuizList />} />}
        />

        {/* Quiz with a specific id route */}
        <Route
          path="/quiz/:id"
          element={<PrivateRoute element={<QuizPage />} />}
        />

        {/* Create Quiz and Question Route (Only for Admin) */}
        <Route path="/admin/create-quiz" element={<CreateQuiz />} />
        <Route path="/admin/create-question" element={<CreateQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
