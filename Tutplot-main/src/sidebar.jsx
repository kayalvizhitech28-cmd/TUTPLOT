import React, { useState } from "react";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./admindashboard";
import StudentAdmission from "./studentadmission";
import Staffdetails from "./staffdetails";
import Feesdetails from "./feesdetails";
import TimeTable from "./timetable";
import ExamsMarks from "./examsmarks";
import Attendance from "./attendance";  

function Sidebar() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = window.location.pathname; // using window.location since useLocation might not be imported

  const isActive = (path) => location === path ? "menu-btn active" : "menu-btn";

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout API
      await fetch("https://tutplot.onrender.com/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    // Navigate to login page
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div className="sidebar">
        <h2 className="logo">TUTPLOT</h2>

        <button onClick={() => navigate("/admindashboard")} className={isActive("/admindashboard")}>📊 Dashboard</button>
        <button onClick={() => navigate("/studentadmission")} className={isActive("/studentadmission")}>🎓 Admission</button>
        <button onClick={() => navigate("/staffdetails")} className={isActive("/staffdetails")}>👨‍🏫 Staff</button>
        <button onClick={() => navigate("/feesdetails")} className={isActive("/feesdetails")}>💳 Fees</button>
        <button onClick={() => navigate("/timetable")} className={isActive("/timetable")}>📅 Time Table</button>
        <button onClick={() => navigate("/examsmarks")} className={isActive("/examsmarks")}>📝 Exams & Marks</button>
        <button onClick={() => navigate("/attendance")} className={isActive("/attendance")}>✅ Attendance</button>
        
        <div className="logout-container">
          <button onClick={confirmLogout} className="logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button onClick={handleLogout} className="modal-btn yes-btn">Yes, Logout</button>
              <button onClick={cancelLogout} className="modal-btn no-btn">No, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;

