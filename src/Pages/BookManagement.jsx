import React, { useState, useEffect } from "react";

export default function BookManagement({ user }) {
  const [books, setBooks] = useState(() => JSON.parse(localStorage.getItem("books")) || []);
  const [form, setForm] = useState({ title: "", author: "", genre: "", isbn: "", quantity: 1 });

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const addBook = () => {
    if (user.role !== "admin") return alert("Only admin can add books");
    if (!form.title || !form.author || !form.genre || !form.isbn) return alert("All fields are required.");
    setBooks([...books, { ...form, id: Date.now() }]);
    setForm({ title: "", author: "", genre: "", isbn: "", quantity: 1 });
    alert("Book added successfully!");
  };

  const updateBook = (id) => {
    if (user.role !== "admin") return alert("Only admin can update books");
    const updated = books.map((b) => b.id === id ? { ...b, ...form } : b);
    setBooks(updated);
    alert("Book updated successfully!");
  };

  const deleteBook = (id) => {
    if (user.role !== "admin") return alert("Only admin can delete books");
    if (window.confirm("Are you sure?")) {
      setBooks(books.filter((b) => b.id !== id));
      alert("Book deleted successfully!");
    }
  };

  return (
    <div className="page-content">
      <h2>Book Management</h2>

      {user.role === "admin" && (
        <div className="admin-form">
          <h3>Add or Update Book</h3>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
          <input placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
          <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })} />
          <button onClick={addBook}>Add Book</button>
        </div>
      )}

      {books.length === 0 && <p>No books available. Please add one.</p>}

      <ul>
        {books.map((b) => (
          <li key={b.id}>
            {b.title} by {b.author} ({b.genre}) — {b.quantity} copies
            {user.role === "admin" && (
              <>
                <button onClick={() => updateBook(b.id)}>Update</button>
                <button onClick={() => deleteBook(b.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

