import React, { useEffect, useState } from "react";
import { getQuizById, submitAnswer } from "../services/quizService";
import { useParams } from "react-router-dom";

function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await getQuizById(id);
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz", error);
      }
    }
    fetchQuiz();
  }, [id]);

  const handleSubmitAnswer = async (questionId, selectedOption) => {
    try {
      const response = await submitAnswer(id, [{ questionId, selectedOption }]);
      setScore(response.data.score); // assuming score is returned from API
    } catch (error) {
      console.error("Error submitting answer", error);
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <h2>{quiz.title}</h2>
      {quiz.questions.map((question) => (
        <div key={question.id}>
          <h3>{question.text}</h3>
          {question.options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={index}
                onChange={() =>
                  setAnswers({ ...answers, [question.id]: index })
                }
              />
              {option}
            </div>
          ))}
          <button
            onClick={() =>
              handleSubmitAnswer(question.id, answers[question.id])
            }
          >
            Submit Answer
          </button>
        </div>
      ))}
      <div>
        <h3>Your Score: {score}</h3>
      </div>
    </div>
  );
}

export default QuizPage;
