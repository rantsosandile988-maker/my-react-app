import React, { useState } from "react";

export default function Register({ setView }) {
  const [form, setForm] = useState({ username: "", password: "", role: "user" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (!form.username || !form.password) {
      alert("All fields are required.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ id: Date.now(), ...form });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful!");
    setView("login");
  };

  return (
    <div className="page-content">
      <h2>Register</h2>
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleRegister}>Signup</button>
    </div>
  );
}
