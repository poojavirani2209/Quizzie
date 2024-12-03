import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.pathname.includes("admin") ? "admin" : "learner";
  const [error, setError] = useState(undefined);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password, role);
      setError(undefined);
      navigate("/quizlist");
    } catch (error) {
      setError(
        `Error loggin in user. Retry after ensuring details are correct or server is up`
      );
      console.error("Error logging in", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>{role === "admin" ? "Admin Login" : "Learner Login"}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button style={{ margin: "5px" }} type="submit">
        Login
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Login;
