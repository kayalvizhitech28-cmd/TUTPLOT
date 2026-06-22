import toast from 'react-hot-toast';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import "./feesdetails.css";
function Feesdetails() {
  const navigate = useNavigate();
  const [studentsList, setStudentsList] = useState([]);

  useEffect(() => {
    fetch("https://tutplot.onrender.com/api/students")
      .then(res => res.json())
      .then(data => setStudentsList(data))
      .catch(err => console.error("Failed to fetch students", err));
  }, []);

  const [formData, setFormData] = useState({
    student_id: "",
    class: "",
    group: "",
    totalfees: "",
    feespaid: "",
    pendingfees: "",
    dateofpayment: "",
    paymentment: "",
  });
  const [paymentInputType, setPaymentInputType] = useState("text");

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "class") {
      // when class is changed, clear selected student, group, and reset fee fields
      newFormData.student_id = "";
      newFormData.group = "";
      newFormData.totalfees = "";
      newFormData.feespaid = "";
      newFormData.pendingfees = "";
    }

    if (name === "student_id") {
      const selectedStudent = studentsList.find(s => String(s.student_id) === String(value));
      if (selectedStudent) {
        newFormData.class = selectedStudent.class || "";
        newFormData.group = selectedStudent.group || selectedStudent.Group || selectedStudent.group_name || selectedStudent.groupName || newFormData.group;
        newFormData.totalfees = selectedStudent.total_fees || "";
        newFormData.feespaid = ""; // reset current payment field when switching student
      } else {
        newFormData.class = "";
        newFormData.group = "";
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
      const response = await fetch("https://tutplot.onrender.com/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.success("Fees Details Added Successfully!");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Error adding fees details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding fees details");
    }
  };

  const isValid = formData.student_id && formData.class && formData.totalfees && formData.feespaid && formData.dateofpayment && formData.paymentment;

  return (
    <div className="layout">
      <Sidebar />

      {/* Main Content */}
      <div className="form-container">
        <h2>Fees Details Form</h2>

        <form onSubmit={handleSubmit}>
          <select name="student_id" value={formData.student_id} onChange={handleChange} required>
            <option value="">Select Student Name</option>
            {studentsList
              .filter(s => {
                if (!formData.class) return true;
                return String(s.class) === String(formData.class);
              })
              .map(student => (
                <option key={student.student_id} value={student.student_id}>
                  {student.student_name}
                </option>
              ))}
          </select>
          <select name="class" value={formData.class} onChange={handleChange} required>
            <option value="">Select Class</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          <input type="number" name="totalfees" value={formData.totalfees} placeholder="Total Fees" onChange={handleChange} required />
          <input type="number" name="feespaid" value={formData.feespaid} placeholder="Fees Paid" onChange={handleChange} required />
          <input type="number" name="pendingfees" value={formData.pendingfees} placeholder="Pending Fees" onChange={handleChange} required readOnly />
          <input
            type={paymentInputType}
            name="dateofpayment"
            value={formData.dateofpayment}
            placeholder="Date of Payment"
            onFocus={() => setPaymentInputType("date")}
            onBlur={() => { if (!formData.dateofpayment) setPaymentInputType("text"); }}
            onChange={handleChange}
            required
          />
          <select name="paymentment" value={formData.paymentment} onChange={handleChange} required>
            <option value="">Select Payment Method</option>
            <option value="gpay">GPay</option>
            <option value="cash">Cash</option>
          </select>

          <button type="submit" disabled={!isValid}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Feesdetails;

