import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Welcome to the QUIZZIE</h1>

      <div style={{ margin: "20px" }}>
        <h3>Learner</h3>
        <Link to="/login">
          <button style={{ margin: "5px" }}>Login as Learner</button>
        </Link>
        <br />
        <Link to="/register">
          <button style={{ margin: "5px" }}>Register as Learner</button>
        </Link>
      </div>

      <div style={{ margin: "20px" }}>
        <h3>Admin</h3>
        <Link to="/admin/login">
          <button style={{ margin: "5px" }}>Login as Admin</button>
        </Link>
        <br />
        <Link to="/admin/register">
          <button style={{ margin: "5px" }}>Register as Admin</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
