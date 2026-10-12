import React, { useState } from "react";
import "./Login.css";

export default function Login({ setCurrentUser, setView }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Hard-coded admin
    const admin = { id: 1, username: "Sandile", password: "Sandile3", role: "admin" };
    if (!users.find((u) => u.username === "Sandile")) {
      users.push(admin);
      localStorage.setItem("users", JSON.stringify(users));
    }

    const found = users.find(
      (u) => u.username === username && u.password === password
    );

    if (found) {
      localStorage.setItem("currentUser", JSON.stringify(found));
      setCurrentUser(found);
      setView("home");
      alert(`Welcome ${found.username}!`);
    } else {
      alert("Invalid credentials.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="community-title">Community Library</h1>
      <div className="login-box">
        <h2>Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>
          No account yet?{" "}
          <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setView("register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
