import React, { useState } from "react"
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import LoginService from "./Services/LoginService";

const LoginForm = () => {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); 

        try {
            const token = await LoginService.login(username, password);
            console.log("Login successful, token:", token);
            localStorage.setItem('token', token);

            setUsername("");
            setPassword("");
        } catch (err) {
            setError(err.message); // Display the error message to the user
        }
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleLogin}>
                <h1>
                    Login
                </h1>
                <div className="input-box">
                    <input type="text" placeholder="Username" value={username} onChange={(e => setUsername(e.target.value))} required />
                    <FaUser className="icon"/>
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <FaLock className="icon"/>
                </div>
                <button type="submit">Login</button>

                {error && <p className="error-message">{error}</p>}

                <div className="register-link">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
            
        </div>
    )
}

export default LoginForm