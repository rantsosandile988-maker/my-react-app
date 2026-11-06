
import React, { useState, useEffect } from "react";

export default function Transactions({ user }) {

  const [books, setBooks] = useState(() =>
    JSON.parse(localStorage.getItem("books")) || []
  );

  const [transactions, setTransactions] = useState(() =>
    JSON.parse(localStorage.getItem("transactions")) || []
  );

  const [users] = useState(() =>
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [manualBookId, setManualBookId] = useState("");
  const [manualType, setManualType] = useState("Borrow");
  const [manualUserId, setManualUserId] = useState(
    String(user.id)
  );
  const [manualQuantity, setManualQuantity] = useState(1);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [books, transactions]);

  const isAdmin = user.role === "admin";

  // FIND BOOK
  const getBook = (id) => {
    return books.find((b) => String(b.id) === String(id));
  };

  // FIND MEMBER
  const getMember = (id) => {
    const member = users.find(
      (u) => String(u.id) === String(id)
    );

    if (member) return member.full_name || member.name || member.email;

    if (String(user.id) === String(id)) {
      return user.full_name || user.name || user.email || "Current User";
    }

    return `User ID ${id}`;
  };

  // UPDATE BOOK QUANTITY
  const updateStock = (bookId, amount) => {
    setBooks((previous) =>
      previous.map((b) =>
        String(b.id) === String(bookId)
          ? { ...b, quantity: Number(b.quantity) + amount }
          : b
      )
    );
  };

  // CHECK MEMBER'S BORROWED BOOKS
  const getOutstanding = (bookId, memberId) => {

    return transactions.reduce((total, t) => {

      if (
        String(t.bookId) === String(bookId) &&
        String(t.userId) === String(memberId)
      ) {
        return total + (
          t.type === "Borrow"
            ? Number(t.quantity || 1)
            : -Number(t.quantity || 1)
        );
      }

      return total;

    }, 0);
  };

  // CREATE TRANSACTION
  const performTransaction = (bookId, type, memberId, quantity = 1) => {

    const book = getBook(bookId);
    const amount = Number(quantity);

    if (!book) {
      alert("Book not found.");
      return false;
    }

    if (!Number.isInteger(amount) || amount < 1) {
      alert("Enter a valid quantity.");
      return false;
    }

    if (type === "Borrow" && Number(book.quantity) < amount) {
      alert("No enough copies available.");
      return false;
    }

    if (type === "Return") {

      const outstanding = getOutstanding(bookId, memberId);

      if (amount > outstanding) {
        alert("This member has not borrowed that many copies.");
        return false;
      }
    }

    // UPDATE STOCK
    if (type === "Borrow") {
      updateStock(bookId, -amount);
    } else {
      updateStock(bookId, amount);
    }

    // SAVE COMPLETE TRANSACTION
    const newTransaction = {

      id: Date.now() + Math.random(),

      type: type,

      bookId: book.id,

      userId: memberId,

      userName: getMember(memberId),

      bookTitle: book.title,

      author: book.author || "N/A",

      genre: book.genre || book.category || "N/A",

      isbn: book.isbn || book.ISBN || "N/A",

      quantity: amount,

      date: new Date().toISOString()

    };

    setTransactions((previous) => [
      newTransaction,
      ...previous
    ]);

    return true;
  };

  // BORROW BOOK
  const borrowBook = (id) => {

    if (!user.id) {
      alert("Please log in first.");
      return;
    }

    if (performTransaction(id, "Borrow", user.id)) {
      alert("Book borrowed successfully!");
    }
  };

  // RETURN BOOK
  const returnBook = (id) => {

    if (!user.id) {
      alert("Please log in first.");
      return;
    }

    if (performTransaction(id, "Return", user.id)) {
      alert("Book returned successfully!");
    }
  };

  // MANUAL TRANSACTION (ADMIN)
  const addTransaction = () => {

    if (!isAdmin) {
      alert("Only admin can add manual transactions.");
      return;
    }

    if (!manualBookId) {
      alert("Please select a book.");
      return;
    }

    if (!manualUserId) {
      alert("Please select a member.");
      return;
    }

    if (performTransaction(
      manualBookId,
      manualType,
      manualUserId,
      manualQuantity
    )) {

      alert("Transaction added successfully!");

      setManualBookId("");
      setManualType("Borrow");
      setManualQuantity(1);
    }
  };

  // DELETE TRANSACTION (ADMIN)
  const deleteTransaction = (id) => {

    if (!isAdmin) {
      alert("Only admin can delete transactions.");
      return;
    }

    const transaction = transactions.find((t) => t.id === id);

    if (!transaction) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction? Book stock will be adjusted."
    );

    if (!confirmDelete) return;

    const book = getBook(transaction.bookId);
    const quantity = Number(transaction.quantity || 1);

    // REVERSE ORIGINAL STOCK CHANGE
    if (book && transaction.type === "Borrow") {
      updateStock(transaction.bookId, quantity);
    }

    if (book && transaction.type === "Return") {

      if (Number(book.quantity) < quantity) {
        alert("Cannot delete this return. Not enough copies are available to reverse it.");
        return;
      }

      updateStock(transaction.bookId, -quantity);
    }

    setTransactions((previous) =>
      previous.filter((t) => t.id !== id)
    );

    alert("Transaction deleted successfully!");
  };

  return (
    <div className="page-content">

      <h2>Transactions</h2>

      {/* ADMIN MANUAL TRANSACTION */}
      {isAdmin && (

        <div className="admin-form">

          <h3>Manual Transaction Entry</h3>

          <label>Select Member</label>

          <select
            value={manualUserId}
            onChange={(e) => setManualUserId(e.target.value)}
          >

            <option value="">Select Member</option>

            {users
              .filter((u) => u.role !== "admin")
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name || u.name || u.email}
                </option>
              ))}

          </select>

          <label>Select Book</label>

          <select
            value={manualBookId}
            onChange={(e) => setManualBookId(e.target.value)}
          >

            <option value="">Select Book</option>

            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} - {b.author || "Unknown Author"}
              </option>
            ))}

          </select>

          <label>Transaction Type</label>

          <select
            value={manualType}
            onChange={(e) => setManualType(e.target.value)}
          >
            <option value="Borrow">Borrow</option>
            <option value="Return">Return</option>
          </select>

          <label>Quantity</label>

          <input
            type="number"
            min="1"
            value={manualQuantity}
            onChange={(e) => setManualQuantity(e.target.value)}
          />

          <button onClick={addTransaction}>
            Add Transaction
          </button>

        </div>
      )}

      {/* AVAILABLE BOOKS */}
      <h3>Available Books</h3>

      <table>

        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Available</th>
            <th>Borrow</th>
            <th>Return</th>
          </tr>
        </thead>

        <tbody>

          {books.map((b) => (

            <tr key={b.id}>

              <td>{b.title}</td>

              <td>{b.author || "N/A"}</td>

              <td>{b.genre || b.category || "N/A"}</td>

              <td>{b.isbn || b.ISBN || "N/A"}</td>

              <td>{b.quantity}</td>

              <td>
                <button
                  onClick={() => borrowBook(b.id)}
                  disabled={Number(b.quantity) < 1}
                >
                  Borrow
                </button>
              </td>

              <td>
                <button onClick={() => returnBook(b.id)}>
                  Return
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* TRANSACTION HISTORY */}
      <h3>Transaction History</h3>

      <table>

        <thead>
          <tr>
            <th>Type</th>
            <th>Member</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Quantity</th>
            <th>Date</th>

            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>

          {transactions.map((t) => {

            const book = getBook(t.bookId);

            return (

              <tr key={t.id}>

                <td>{t.type}</td>

                <td>{t.userName || getMember(t.userId)}</td>

                <td>
                  {t.bookTitle || book?.title || `Book ID ${t.bookId}`}
                </td>

                <td>{t.author || book?.author || "N/A"}</td>

                <td>
                  {t.genre || book?.genre || book?.category || "N/A"}
                </td>

                <td>
                  {t.isbn || book?.isbn || book?.ISBN || "N/A"}
                </td>

                <td>{t.quantity || 1}</td>

                <td>
                  {t.date
                    ? new Date(t.date).toLocaleString()
                    : "N/A"}
                </td>

                {isAdmin && (
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTransaction(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}

              </tr>

            );

          })}

          {transactions.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 9 : 8}>
                No transaction history available.
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}
