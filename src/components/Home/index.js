
import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function Home() {
  return (
    <div className="home-container">
      <header className="navbar">
        <h1 className="logo">Medi<span>TRACK</span></h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="#features">Features</Link>
          <Link to="#roles">Roles</Link>
          <Link to="/login" className="login-btn">Login</Link>
        </nav>
      </header>

      <section className="hero">
        <h2>Welcome to MediTRACK</h2>
        <p>Your trusted companion for tracking and managing medications efficiently.</p>
        <Link to="/signup" className="cta-button">Start Now</Link>
      </section>

      <section className="roles" id="roles">
        <h3>Who is this for?</h3>
        <div className="roles-grid">
          <div className="role-card patient">
            <h4>Patients</h4>
            <p>Track your daily medication intake, set reminders, and monitor your progress with ease.</p>
          </div>
          <div className="role-card caretaker">
            <h4>Caretakers</h4>
            <p>Manage multiple patients' schedules, mark medications as taken, and ensure adherence remotely.</p>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <h3>Key Features</h3>
        <ul>
          <li>🔒 Secure login and signup with role-based access</li>
          <li>📋 Medication CRUD (Add, View, Update, Delete)</li>
          <li>📅 Daily intake tracking with calendar view</li>
          <li>📈 Adherence monitoring and progress display</li>
        </ul>
      </section>

      <footer className="footer">
        <p>© 2025 MediTRACK. Empowering better health management.</p>
      </footer>
    </div>
  );
}

export default Home;