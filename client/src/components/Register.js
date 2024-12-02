import React, { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

/** Component to show Registeration form based on Admin/Learner role. Once regsitered successfully it navigates to login page */
export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.pathname.includes("admin") ? "admin" : "learner";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, role);
      navigate("/login");
    } catch (error) {
      console.error("Error registering", error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
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
      <button style={{ margin: "5px" }} type="submit">Register</button>
    </form>
  );
}

export default Register;
