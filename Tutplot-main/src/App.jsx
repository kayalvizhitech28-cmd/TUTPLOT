import './App.css';
import Signup from './signup.jsx'; 
import { Routes, Route } from "react-router-dom";
import Layout from './layout.jsx';
import LoginPage from './login.jsx';
import AdminDashboard from './admindashboard.jsx';
import StudentAdmission from './studentadmission.jsx';  
import Staffdetails from './staffdetails.jsx';
import Feesdetails from './feesdetails.jsx';
import TimeTable from './timetable.jsx';
import ExamsMarks from './examsmarks.jsx';
import Attendance from './attendance.jsx';  
function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/sign up" element={<AdminDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/layout" element={<Layout />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/studentadmission" element={<StudentAdmission />} />
      <Route path="/staffdetails" element={<Staffdetails />} />
      <Route path="/feesdetails" element={<Feesdetails />} />
      <Route path="/timetable" element={<TimeTable />} />
      <Route path="/examsmarks" element={<ExamsMarks />} />
      <Route path="/attendance" element={<Attendance />} /> 
    </Routes>
  );
}

export default App