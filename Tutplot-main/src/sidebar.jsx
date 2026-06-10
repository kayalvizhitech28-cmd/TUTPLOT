import React from "react";
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

  const navigate = useNavigate();
  const location = window.location.pathname; // using window.location since useLocation might not be imported

  const isActive = (path) => location === path ? "menu-btn active" : "menu-btn";

  return (
    <div className="sidebar">
      <h2 className="logo">TUTPLOT</h2>

      <button onClick={() => navigate("/admindashboard")} className={isActive("/admindashboard")}>📊 Dashboard</button>
      <button onClick={() => navigate("/studentadmission")} className={isActive("/studentadmission")}>🎓 Admission</button>
      <button onClick={() => navigate("/staffdetails")} className={isActive("/staffdetails")}>👨‍🏫 Staff</button>
      <button onClick={() => navigate("/feesdetails")} className={isActive("/feesdetails")}>💳 Fees</button>
      <button onClick={() => navigate("/timetable")} className={isActive("/timetable")}>📅 Time Table</button>
      <button onClick={() => navigate("/examsmarks")} className={isActive("/examsmarks")}>📝 Exams & Marks</button>
      <button onClick={() => navigate("/attendance")} className={isActive("/attendance")}>✅ Attendance</button>
    </div>
  );
}

export default Sidebar;

