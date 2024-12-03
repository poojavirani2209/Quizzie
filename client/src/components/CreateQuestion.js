import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../services/quizService";

function CreateQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [error, setError] = useState(undefined);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    const newQuestion = {
      text: questionText,
      options,
      correctOption,
    };
    try {
      await createQuestion(newQuestion);
      setError(undefined);
      navigate("/admin/create-quiz"); // Redirect back to the create quiz page after question creation
    } catch (error) {
      setError(
        `Error occurred while creating question. Retry after ensuring server is up or user is logged in`
      );
      console.error("Error creating question:", error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Create Question</h2>
      <form onSubmit={handleCreateQuestion}>
        <input
          type="text"
          placeholder="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
        <br />
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <br />
        <input
          type="number"
          value={correctOption}
          onChange={(e) => setCorrectOption(parseInt(e.target.value))}
          min="0"
          max="3"
          required
          placeholder="Correct Option Index (0-3)"
        />
        <br />
        <button style={{ margin: "5px" }} type="submit">
          Create Question
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default CreateQuestion;
