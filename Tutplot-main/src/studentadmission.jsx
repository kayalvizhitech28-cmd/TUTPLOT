import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import "./studentadmission.css";

function StudentAdmission() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("add"); // "add" or "view"
  const [filterClass, setFilterClass] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // State for fetched DB data
  const [dbStudents, setDbStudents] = useState([]);

  useEffect(() => {
    if (viewMode === "view") {
      fetch("http://localhost:3000/api/students")
        .then(res => res.json())
        .then(data => {
          // Map DB fields to frontend format
          const mappedData = data.map(s => ({
            id: s.student_id,
            name: s.student_name,
            class: s.class || "Not Assigned",
            group: s.group_class || "",
            dob: s.date_of_birth ? s.date_of_birth.split('T')[0] : "N/A",
            motherName: s.mother_name || "N/A", 
            parent: s.father_name || "N/A",     
            contact: s.contact_number || "N/A",    
            schoolName: s.school_name || "N/A", 
            fee: s.total_fees !== undefined && s.total_fees !== null ? `₹${s.total_fees}` : "₹0", 
            pendingFee: s.pending_fees !== undefined && s.pending_fees !== null ? `₹${s.pending_fees}` : "₹0",  
            address: s.address || "N/A"
          }));
          setDbStudents(mappedData);
        })
        .catch(err => console.error("Failed to fetch students", err));
    }
  }, [viewMode]);

  const filteredStudents = filterClass === "All" 
    ? dbStudents 
    : dbStudents.filter(s => String(s.class) === String(filterClass));

  const [formData, setFormData] = useState({
    Name: "",
    DateofBirth: "",
    Standard: "",
    Group: "",
    MotherName: "",
    FatherName: "",
    schoolName: "",
    fee: "",
    contact: "",
    Address: "",
  });
  const [dobInputType, setDobInputType] = useState("text");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "fee" ? value.replace(/[^0-9,]/g, "") : value,
      ...(name === "Standard" && value !== "11th" && value !== "12th" ? { Group: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((formData.Standard === "11th" || formData.Standard === "12th") && !formData.Group.trim()) {
      alert("Please enter the group for 11th/12th class before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Student Added Successfully!");
        navigate("/staffdetails");
      } else {
        alert("Failed to add student");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

    <div className="main">
      <div className="toggle-header">
        <h1>STUDENT ADMISSION</h1>
        <div className="toggle-buttons">
          <button 
            className={`toggle-btn ${viewMode === "add" ? "active" : ""}`}
            onClick={() => setViewMode("add")}
          >
            Add New
          </button>
          <button 
            className={`toggle-btn ${viewMode === "view" ? "active" : ""}`}
            onClick={() => setViewMode("view")}
          >
            View Existing
          </button>
        </div>
      </div>

      {viewMode === "add" ? (
        <div className="form-container">
          <h2>Student Admission Form</h2>
          <form onSubmit={handleSubmit}>
            <input name="Name" placeholder="Student Name" onChange={handleChange} required />
            <input
              type={dobInputType}
              name="DateofBirth"
              placeholder="Date of Birth"
              value={formData.DateofBirth}
              onFocus={() => setDobInputType("date")}
              onBlur={() => { if (!formData.DateofBirth) setDobInputType("text"); }}
              onChange={handleChange}
              required
            />
            <select name="Standard" value={formData.Standard} onChange={handleChange} required>
              <option value="">Select Class</option>
              <option value="10">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
            {(formData.Standard === "11th" || formData.Standard === "12th") && (
              <input
                name="Group"
                placeholder={`${formData.Standard} Group`}
                value={formData.Group}
                onChange={handleChange}
                required
              />
            )}
            <input name="MotherName" placeholder="Mother Name" onChange={handleChange} required />
            <input name="FatherName" placeholder="Father Name" onChange={handleChange} required />
            <input name="schoolName" placeholder="School Name" onChange={handleChange} required />
            <input name="contact" placeholder="Contact Number" onChange={handleChange} required />
            <input name="fee" placeholder="Fees" value={formData.fee} onChange={handleChange} />
            <textarea name="Address" placeholder="Address" onChange={handleChange} required />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <div className="view-container">
          <div className="filter-bar">
            <label>Filter by Class: </label>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="All">All Classes</option>
              <option value="10">10th</option>
              <option value="11">11th</option>
              <option value="12">12th</option>
            </select>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Group</th>
                <th>Parent Name</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} onClick={() => setSelectedStudent(student)} className="clickable-row">
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td><span className={`badge class-${student.class}`}>{student.class}</span></td>
                    <td>{student.group || "-"}</td>
                    <td>{student.parent}</td>
                    <td>{student.contact}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No students found in this class.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    
    {selectedStudent && (
      <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>Student Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <p><strong>ID:</strong> {selectedStudent.id}</p>
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>DOB:</strong> {selectedStudent.dob}</p>
            <p><strong>Class:</strong> {selectedStudent.class}</p>
            <p><strong>Group:</strong> {selectedStudent.group || "N/A"}</p>
            <p><strong>Mother Name:</strong> {selectedStudent.motherName}</p>
            <p><strong>Father Name:</strong> {selectedStudent.parent}</p>
            <p><strong>Contact:</strong> {selectedStudent.contact}</p>
            <p><strong>School Name:</strong> {selectedStudent.schoolName}</p>
            <p><strong>Total Fees:</strong> {selectedStudent.fee}</p>
            <p>
              <strong>Pending Fees:</strong> 
              <span style={{ color: selectedStudent.pendingFee !== "₹0" ? "#e11d48" : "#16a34a", fontWeight: "bold" }}>
                {selectedStudent.pendingFee}
              </span>
            </p>
            <p style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {selectedStudent.address}</p>
          </div>
          <button className="close-modal-btn" onClick={() => setSelectedStudent(null)}>Close</button>
        </div>
      </div>
    )}

  </div>
  );
}

export default StudentAdmission;