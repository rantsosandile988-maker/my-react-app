import React, { useState, useEffect } from "react";

export default function Transactions({ user }) {
  const [books, setBooks] = useState(() => JSON.parse(localStorage.getItem("books")) || []);
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem("transactions")) || []);

  const [manualBookId, setManualBookId] = useState("");
  const [manualType, setManualType] = useState("Borrow");

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [books, transactions]);

  const borrowBook = (id) => {
    const book = books.find((b) => b.id === id);
    if (book && book.quantity > 0) {
      setBooks(books.map((b) => b.id === id ? { ...b, quantity: b.quantity - 1 } : b));
      setTransactions([...transactions, { id: Date.now(), type: "Borrow", bookId: id, userId: user.id }]);
    } else alert("No copies available.");
  };

  const returnBook = (id) => {
    setBooks(books.map((b) => b.id === id ? { ...b, quantity: b.quantity + 1 } : b));
    setTransactions([...transactions, { id: Date.now(), type: "Return", bookId: id, userId: user.id }]);
  };

  const deleteTransaction = (id) => {
    if (user.role !== "admin") return alert("Only admin can delete transactions");
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const addTransaction = () => {
    if (!manualBookId) return alert("Book ID required.");
    setTransactions([...transactions, {
      id: Date.now(),
      type: manualType,
      bookId: parseInt(manualBookId),
      userId: user.id
    }]);
    alert("Transaction added successfully!");
    setManualBookId("");
    setManualType("Borrow");
  };

  return (
    <div className="page-content">
      <h2>Transactions</h2>

      {user.role === "admin" && (
        <div className="admin-form">
          <h3>Manual Transaction Entry</h3>
          <input type="text" placeholder="Book ID" value={manualBookId} onChange={(e) => setManualBookId(e.target.value)} />
          <select value={manualType} onChange={(e) => setManualType(e.target.value)}>
            <option value="Borrow">Borrow</option>
            <option value="Return">Return</option>
          </select>
          <button onClick={addTransaction}>Add Transaction</button>
        </div>
      )}

      <table>
        <thead>
          <tr><th>Book</th><th>Available</th><th>Borrow</th><th>Return</th></tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.quantity}</td>
              <td><button onClick={() => borrowBook(b.id)}>Borrow</button></td>
              <td><button onClick={() => returnBook(b.id)}>Return</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr><th>Type</th><th>Book</th><th>User ID</th>{user.role === "admin" && <th>Actions</th>}</tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const book = books.find((b) => b.id === t.bookId);
            return (
              <tr key={t.id}>
                <td>{t.type}</td>
                <td>{book ? book.title : `Book ID ${t.bookId}`}</td>
                <td>{t.userId}</td>
                {user.role === "admin" && (
                  <td><button onClick={() => deleteTransaction(t.id)}>Delete</button></td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
