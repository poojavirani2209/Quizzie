import React, { useEffect, useState } from "react";
import { getQuizzes, getResults } from "../services/quizService";
import { useNavigate } from "react-router-dom";
import { getCurrentUserData } from "../services/authService";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [userScores, setUserScores] = useState(new Map());
  const navigate = useNavigate();
  const user = getCurrentUserData();

  useEffect(() => {
    getQuizzes()
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      });
  }, []);

  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleCreateQuiz = () => {
    navigate("/admin/create-quiz");
  };

  const fetchScore = async (quizId) => {
    try {
      const response = await getResults(quizId);
      setUserScores(new Map(userScores.set(quizId, response.data.score)));
    } catch (error) {
      console.error("Error fetching score:", error);
    }
  };
  return (
    <div>
      <h1>All Quizzes</h1>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            {quiz.title}
            <button  style={{ margin: "5px" }} onClick={() => handleQuizClick(quiz.id)}>Play</button>
            <button  style={{ margin: "5px" }} onClick={() => fetchScore(quiz.id)}>Get Results</button>
            {/* Show score if it's available */}
            {userScores.has(quiz.id) && (
              <span> - Your Score: {userScores.get(quiz.id)}</span>
            )}
          </li>
        ))}
      </ul>
      {user?.role === 1 && (
        <button style={{ margin: "5px" }} onClick={handleCreateQuiz}>Create Quiz</button>
      )}
    </div>
  );
}

export default QuizList;
