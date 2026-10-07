import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../Services/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await api.get(
        `/users?email=${encodeURIComponent(cleanEmail)}`
      );

      if (response.data.length > 0) {
        setError("Email already exists");
        return;
      }

      // Everyone who signs up is a normal "user". Only an admin can promote someone to admin.
      await api.post("/users", {
        name: name.trim(),
        email: cleanEmail,
        password,
        role: "user",
        createdAt: new Date().toISOString().slice(0, 10),
      });

      navigate("/login");
    } catch {
      setError("Signup failed. Please try again.");
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h1>Create Account</h1>
        <p className="auth-sub">Create a customer account to book and track shipments.</p>

        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Signup</button>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
