import React from "react";

export default function Users() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return <p>Please login to view users.</p>;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  return (
    <div className="page-content">
      <h2>Registered Users</h2>
      <table>
        <thead>
          <tr><th>Username</th><th>Role</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
