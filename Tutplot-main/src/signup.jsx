import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    mobile: ""   // ✅ added mobile field
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://tutplot.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast(data.message);
        navigate("/admindashboard");  // ✅ navigate only after success
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (err) {
      toast.error("Server error, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = formData.email.trim() && formData.password.trim() && formData.confirmPassword.trim() && formData.mobile.trim() && formData.password === formData.confirmPassword;

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">TUTPLOT</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            className="input"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />


          <button type="submit" className="btn" disabled={!isValid || isLoading}>
            {isLoading ? "Loading..." : "SIGN UP"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="link"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;


