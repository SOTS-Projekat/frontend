import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import AuthenticationService from "../Services/AuthenticationService";
import { useNavigate, Link } from "react-router-dom";
import { useSession } from "../../hooks/useSession";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { login } = useSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = await AuthenticationService.login(username, password);
      console.log("Login successful, token:", token);

      login(token);

      setUsername("");
      setPassword("");
      navigate("/home");
    } catch (err) {
      setError(err.message ?? "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
          <button type="submit">Login</button>

          {error && <p className="error-message">{error}</p>}

          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
