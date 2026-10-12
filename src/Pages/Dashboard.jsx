import React from "react";

export default function Dashboard({ searchTerm }) {
  const books = JSON.parse(localStorage.getItem("books")) || [];

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-content">
      <h2>Books Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Author</th><th>Genre</th><th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((b) => (
            <tr key={b.id} style={{ background: b.quantity < 2 ? "#ffcccc" : "transparent" }}>
              <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>{b.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
