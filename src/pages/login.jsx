import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../Services/api";
import { saveSession } from "../Services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.get(
        `/users?email=${encodeURIComponent(email.trim().toLowerCase())}`
      );

      const user = response.data.find((item) => item.password === password);

      if (user) {
        saveSession(user); // saves id, name, email and role (admin / user)
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Unable to connect to server. Is json-server running?");
    }
  }

  function fill(e, p) {
    setEmail(e);
    setPassword(p);
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        <p className="auth-sub">Admins and customers sign in here.</p>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>

        <div className="demo-box">
          <small>Demo accounts (click to fill)</small>
          <div>
            <button type="button" onClick={() => fill("admin@logitrack.com", "admin123")}>
              🛡️ Admin
            </button>
            <button type="button" onClick={() => fill("user@logitrack.com", "user123")}>
              👤 User
            </button>
          </div>
        </div>

        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
        <p><Link to="/track">🔍 Track a shipment without login</Link></p>
      </form>
    </div>
  );
}

export default Login;
