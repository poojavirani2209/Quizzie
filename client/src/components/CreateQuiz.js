import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz, getQuestions } from "../services/quizService";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [error, setError] = useState(undefined);

  const navigate = useNavigate();

  // Fetch all existing questions from the API
  useEffect(() => {
    getQuestions()
      .then((response) => {
        setAllQuestions(response.data);
        setError(undefined);
      })
      .catch((error) => {
        setError(
          `Error fetching questions. Retry after ensuring user it logged in or the server is up.`
        );
        console.error("Error fetching questions:", error);
      });
  }, []);

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    const newQuiz = {
      title,
      questions: selectedQuestions, // Array of selected question IDs
    };
    try {
      const response = await createQuiz(newQuiz);
      console.log("Quiz created:", response.data);
      navigate("/quizlist"); // Redirect to admin home page after quiz creation
      setError(undefined);
    } catch (error) {
      setError(`Error occurred while creating quiz`);
      console.error("Error creating quiz:", error);
    }
  };

  const handleAddQuestion = () => {
    navigate("/admin/create-question"); // Navigate to CreateQuestion component
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prevQuestions) => {
      if (prevQuestions.includes(questionId)) {
        return prevQuestions.filter((id) => id !== questionId);
      } else {
        return [...prevQuestions, questionId];
      }
    });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Create Quiz</h2>
      <form onSubmit={handleAddQuiz}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <h3>Select Questions</h3>
        <select
          multiple
          onChange={(e) => handleQuestionSelect(Number(e.target.value))}
        >
          {allQuestions.map((question) => (
            <option key={question.id} value={question.id}>
              {question.text}
            </option>
          ))}
        </select>
        <br />
        <button style={{ margin: "5px" }} type="submit">
          Create Quiz
        </button>
        <br />
        <button
          style={{ margin: "5px" }}
          type="button"
          onClick={handleAddQuestion}
        >
          Create Question
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default CreateQuiz;
