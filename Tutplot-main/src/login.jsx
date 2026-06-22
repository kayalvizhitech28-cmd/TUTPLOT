import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import admindashboard from "./admindashboard";
import "./login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewState, setViewState] = useState("login"); // login, forgot_phone, forgot_otp, forgot_new_password
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("https://tutplot.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast(data.message);
        navigate("/admindashboard");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      toast.error("Server error, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1 className="title">TUTPLOT</h1>
        
        {viewState === "login" && (
          <>
            <p className="login-text">Login Now</p>

            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              className="login-btn"
              disabled={!email.trim() || !password.trim() || isLoading}
            >
              {isLoading ? "Loading..." : "LOG IN"}
            </button>

            <p className="forgot" onClick={() => setViewState("forgot_phone")}>
              Forgot Password ?
            </p>
          </>
        )}

        {viewState === "forgot_phone" && (
          <>
            <p className="login-text">Enter Phone Number for OTP</p>

            <input
              type="tel"
              placeholder="Phone Number"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
        
            <button onClick={() => setViewState("forgot_otp")} className="login-btn">
              Send OTP
            </button>

            <p className="forgot" onClick={() => setViewState("login")}>
              Back to Login
            </p>
          </>
        )}

        {viewState === "forgot_otp" && (
          <>
            <p className="login-text">Enter OTP sent to {phone}</p>

            <input
              type="text"
              placeholder="Enter OTP"
              className="input-field"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
        
            <button onClick={() => setViewState("forgot_new_password")} className="login-btn">
              Verify OTP
            </button>

            <p className="forgot" onClick={() => setViewState("forgot_phone")}>
              Back
            </p>
          </>
        )}

        {viewState === "forgot_new_password" && (
          <>
            <p className="login-text">Set New Password</p>

            <input
              type="password"
              placeholder="New Password"
              className="input-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
        
            <button 
              onClick={() => {
                toast.success("Password successfully reset!");
                setViewState("login");
              }} 
              className="login-btn"
            >
              Set New Password
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default LoginPage;

