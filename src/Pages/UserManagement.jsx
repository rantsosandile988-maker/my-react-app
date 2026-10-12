import React, { useState, useEffect } from "react";

export default function UserManagement({ user }) {
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

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
