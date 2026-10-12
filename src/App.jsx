import React, { useState } from "react";
import "./App.css";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Transactions from "./Pages/Transactions";
import UserManagement from "./Pages/UserManagement";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import BookManagement from "./Pages/BookManagement";

export default function App() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [view, setView] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setView("login");
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">Community Library</div>
        <nav className="nav-bar">
          <a onClick={() => setView("home")}>Home</a>
          <a onClick={() => setView("books")}>Books</a>
          {currentUser && <a onClick={() => setView("users")}>Users</a>}
          <a onClick={() => setView("transactions")}>Transactions</a>
          <a onClick={() => setView("management")}>Manage</a>
          {!currentUser ? (
            <>
              <button onClick={() => setView("login")}>Login</button>
              <button onClick={() => setView("register")}>Signup</button>
            </>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      {view === "home" && (
        <section className="hero-section">
          <h1>
            Find <span className="highlight">books</span> for both leisure and learning.
          </h1>
          <p>Read • Learn • Grow</p>
          <p className="subtext">
            There is no limit to imagination — open a book and begin your journey.
          </p>
          <div className="search-bar">
            <button className="start-btn" onClick={() => setView("books")}>
              Get Started
            </button>
            <input
              type="text"
              placeholder="Search book"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn" onClick={() => setView("books")}>
              Search
            </button>
          </div>
        </section>
      )}

      {/* Guarded Pages */}
      {view === "books" && (
        currentUser ? <Dashboard searchTerm={searchTerm} /> : <p>Please login to view books.</p>
      )}
      {view === "users" && (
        currentUser ? <Users /> : <p>Please login to view users.</p>
      )}
      {view === "transactions" && (
        currentUser ? <Transactions user={currentUser} /> : <p>Please login to manage transactions.</p>
      )}
      {view === "management" && (
        currentUser ? <UserManagement user={currentUser} /> : <p>Please login to manage users.</p>
      )}
      {view === "login" && <Login setCurrentUser={setCurrentUser} setView={setView} />}
      {view === "register" && <Register setView={setView} />}
      {view === "bookmanage" && (
        currentUser ? <BookManagement user={currentUser} /> : <p>Please login to manage books.</p>
      )}

      {/* About Section */}
      {view === "about" && (
        <section className="about-section">
          <h2>About Us</h2>
          <p>
            Messi Library provides access to books, users, and transactions for learning and leisure.
            It’s designed to help students and readers manage their library interactions easily.
          </p>
        </section>
      )}
    </div>
  );
}

