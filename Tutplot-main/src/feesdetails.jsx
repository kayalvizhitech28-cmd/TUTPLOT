import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import "./feesdetails.css";
function Feesdetails() {
  const navigate = useNavigate();
  const [studentsList, setStudentsList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/students")
      .then(res => res.json())
      .then(data => setStudentsList(data))
      .catch(err => console.error("Failed to fetch students", err));
  }, []);

  const [formData, setFormData] = useState({
    student_id: "",
    class: "",
    totalfees: "",
    feespaid: "",
    pendingfees: "",
    dateofpayment: "",
    paymentment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "student_id") {
      const selectedStudent = studentsList.find(s => String(s.student_id) === String(value));
      if (selectedStudent) {
        newFormData.class = selectedStudent.class || "";
        newFormData.totalfees = selectedStudent.total_fees || "";
        newFormData.feespaid = ""; // reset current payment field when switching student
      } else {
        newFormData.class = "";
        newFormData.totalfees = "";
        newFormData.feespaid = "";
      }
    }

    // Recalculate pending fees
    let prevPaid = 0;
    if (newFormData.student_id) {
      const selectedStudent = studentsList.find(s => String(s.student_id) === String(newFormData.student_id));
      if (selectedStudent) {
        const dbTotal = selectedStudent.total_fees || 0;
        const dbPending = selectedStudent.pending_fees !== null && selectedStudent.pending_fees !== undefined ? selectedStudent.pending_fees : dbTotal;
        prevPaid = dbTotal - dbPending;
      }
    }

    const currentTotal = Number(newFormData.totalfees) || 0;
    const currentPaid = Number(newFormData.feespaid) || 0;
    newFormData.pendingfees = currentTotal - prevPaid - currentPaid;

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Fees Details Added Successfully!");
        navigate("/timetable");
      } else {
        alert("Error adding fees details");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding fees details");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      {/* Main Content */}
      <div className="form-container">
        <h2>Fees Details Form</h2>

        <form onSubmit={handleSubmit}>
          <select name="student_id" value={formData.student_id} onChange={handleChange} required>
            <option value="">Select Student Name</option>
            {studentsList.map(student => (
              <option key={student.student_id} value={student.student_id}>
                {student.student_name}
              </option>
            ))}
          </select>
          <input name="class" value={formData.class} placeholder="Class" onChange={handleChange} required />
          <input type="number" name="totalfees" value={formData.totalfees} placeholder="Total Fees" onChange={handleChange} required />
          <input type="number" name="feespaid" value={formData.feespaid} placeholder="Fees Paid" onChange={handleChange} required />
          <input type="number" name="pendingfees" value={formData.pendingfees} placeholder="Pending Fees" onChange={handleChange} required readOnly />
          <input type="date" name="dateofpayment" value={formData.dateofpayment} placeholder="Date of Payment" onChange={handleChange} required />
          <select name="paymentment" value={formData.paymentment} onChange={handleChange} required>
            <option value="">Select Payment Method</option>
            <option value="gpay">GPay</option>
            <option value="cash">Cash</option>
          </select>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Feesdetails;