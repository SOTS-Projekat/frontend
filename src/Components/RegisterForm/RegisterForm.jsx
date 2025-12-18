import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import AuthenticationService from '../Services/AuthenticationService';
import '../LoginForm/LoginForm.css';

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await AuthenticationService.register(email, username, password);
            setSuccess("Registration successful!"); // Success message for the user
            setEmail("");
            setUsername("");
            setPassword("");
        } catch (err) {
            setError(err.message); // Display the error message to the user
        }
    };

    return (
        <div className="login-page">
            <div className="wrapper">
                <form onSubmit={handleRegister}>
                    <h1>
                        Register
                    </h1>
                    <div className="input-box">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <FaEnvelope className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <FaLock className="icon" />
                    </div>
                    <button type="submit">Register</button>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <div className="register-link">
                        <p>Already have an account? <a href="#" onClick={() => {/* logic to switch to login */ }}>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm;
