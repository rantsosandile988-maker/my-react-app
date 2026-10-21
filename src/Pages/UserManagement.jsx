import React, { useState, useEffect } from "react";

export default function UserManagement({ user }) {
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || []);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = () => {
    if (!newUser.username || !newUser.password) return alert("All fields required.");
    setUsers([...users, { id: Date.now(), ...newUser }]);
    alert("User added successfully!");
    setNewUser({ username: "", password: "", role: "user" });
  };

  const deleteUser = (id) => {
    if (user.role !== "admin") return alert("Only admin can delete users");
    if (window.confirm("Are you sure?")) {
      setUsers(users.filter((u) => u.id !== id));
      alert("User deleted successfully!");
    }
  };

  const editProfile = (id) => {
    if (user.id !== id) return alert("You can only edit your own profile");
    const newUsername = prompt("Enter new username:", user.username);
    const newPassword = prompt("Enter new password:", user.password);
    if (!newUsername || !newPassword) return alert("Both fields required.");
    const updated = users.map((u) =>
      u.id === id ? { ...u, username: newUsername, password: newPassword } : u
    );
    setUsers(updated);
    alert("Profile updated successfully!");
  };

  return (
    <div className="page-content">
      <h2>User Management</h2>

      {user.role === "admin" && (
        <div className="admin-form">
          <h3>Add New User</h3>
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={addUser}>Add User</button>
        </div>
      )}

      <table>
        <thead>
          <tr><th>Username</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                {user.role === "admin" && <button onClick={() => deleteUser(u.id)}>Delete</button>}
                {user.id === u.id && <button onClick={() => editProfile(u.id)}>Edit Profile</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
