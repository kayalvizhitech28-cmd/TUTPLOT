import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import "./attendance.css";

function Attendance() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    standard: "",
    date: "",
    staff: "",
  });

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("add"); // "add" or "view"
  const [filterClass, setFilterClass] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [dbAttendance, setDbAttendance] = useState([]);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (viewMode === "view") {
      fetch("http://localhost:3000/api/attendance")
        .then(res => res.json())
        .then(data => setDbAttendance(data))
        .catch(err => console.error("Failed to fetch attendance", err));
    }
  }, [viewMode]);

  useEffect(() => {
    fetch("http://localhost:3000/api/students")
      .then((res) => res.json())
      .then((data) => {
        let filtered = data;
        if (form.standard) {
          filtered = data.filter(s => String(s.class) === form.standard);
        }
        
        const mapped = filtered.map((s) => ({
          id: s.student_id,
          name: s.student_name,
          status: "absent",
        }));
        setStudents(mapped);
      })
      .catch((err) => console.error("Failed to load students", err));
  }, [form.standard]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function setStatus(id, newStatus) {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, status: newStatus } : student
      )
    );
  }

  function markAllPresent() {
    setStudents(students.map((s) => ({ ...s, status: "present" })));
  }

  function clearAll() {
    setStudents(students.map((s) => ({ ...s, status: "absent" })));
  }

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.length - presentCount;

  async function handleSubmit() {
    try {
      const response = await fetch("http://localhost:3000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, students })
      });
      if (response.ok) {
        alert("Attendance Submitted!");
        navigate("/admindashboard");
      } else {
        alert("Error saving attendance");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving attendance");
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="toggle-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>ATTENDANCE</h1>
          <div className="toggle-buttons" style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`toggle-btn ${viewMode === "add" ? "active" : ""}`}
              onClick={() => setViewMode("add")}
              style={{ padding: '8px 16px', background: viewMode === 'add' ? 'var(--primary)' : '#e2e8f0', color: viewMode === 'add' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Take Attendance
            </button>
            <button 
              className={`toggle-btn ${viewMode === "view" ? "active" : ""}`}
              onClick={() => setViewMode("view")}
              style={{ padding: '8px 16px', background: viewMode === 'view' ? 'var(--primary)' : '#e2e8f0', color: viewMode === 'view' ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              View Attendance
            </button>
          </div>
        </div>

        {viewMode === "add" ? (
          <>
            {/* Top Section */}
        <div className="top">
          <select
            name="standard"
            value={form.standard}
            onChange={handleChange}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            <option value="">Select Standard</option>
            <option value="10">10th Standard</option>
            <option value="11">11th Standard</option>
            <option value="12">12th Standard</option>
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <input
            type="text"
            name="staff"
            placeholder="Handling Staff"
            value={form.staff}
            onChange={handleChange}
          />
        </div>

        {/* Controls */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search student..."
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={markAllPresent}>Mark All Present</button>
          <button onClick={clearAll}>Clear All</button>
        </div>

        {/* Table */}
        <div className="table">
          <div className="table-header">
            <div>S.No</div>
            <div>Student Name</div>
            <div>Status</div>
          </div>

          {filteredStudents.map((student) => (
            <div
              className={`row ${student.status}`}
              key={student.id}
            >
              <div>{student.id}</div>
              <div>{student.name}</div>

              <div className="status-buttons">
                <button
                  className={`status-btn present-btn ${student.status === "present" ? "active" : ""
                    }`}
                  onClick={() => setStatus(student.id, "present")}
                >
                  Present
                </button>
                <button
                  className={`status-btn absent-btn ${student.status === "absent" ? "active" : ""
                    }`}
                  onClick={() => setStatus(student.id, "absent")}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="summary">
          <div>Present: {presentCount}</div>
          <div>Absent: {absentCount}</div>
          <div>Total: {students.length}</div>
        </div>

            <button className="submit-btn" onClick={handleSubmit}>
              SUBMIT
            </button>
          </>
        ) : (
          <div className="view-container">
            {/* Top Section / Filter Bar */}
            <div className="top" style={{ justifyContent: 'flex-start', gap: '15px', marginBottom: '20px' }}>
              <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
                <option value="">All Classes</option>
                <option value="10">10th Standard</option>
                <option value="11">11th Standard</option>
                <option value="12">12th Standard</option>
              </select>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} />
            </div>
            
            {/* Table */}
            <div className="table">
              <div className="table-header" style={{ gridTemplateColumns: '1fr 100px 120px 200px' }}>
                <div style={{ textAlign: 'left' }}>Student Name</div>
                <div>Class</div>
                <div>Date</div>
                <div style={{ textAlign: 'center' }}>Status</div>
              </div>
              
              {(() => {
                const viewFilteredAttendance = dbAttendance.filter(a => (!filterClass || String(a.standard) === String(filterClass)) && (!filterDate || (a.date && new Date(a.date).toISOString().split('T')[0] === filterDate)));
                const viewPresentCount = viewFilteredAttendance.filter(a => a.status === "present").length;
                const viewAbsentCount = viewFilteredAttendance.length - viewPresentCount;

                return (
                  <>
                    {viewFilteredAttendance.map((record) => (
                      <div className={`row ${record.status}`} key={record.id} style={{ gridTemplateColumns: '1fr 100px 120px 200px' }}>
                        <div style={{ textAlign: 'left' }}>{record.name}</div>
                        <div>{record.standard}</div>
                        <div>{record.date ? new Date(record.date).toLocaleDateString() : "N/A"}</div>
                        <div className="status-buttons" style={{ justifyContent: 'center' }}>
                          <button
                            className={`status-btn present-btn ${record.status === "present" ? "active" : ""}`}
                            disabled
                            style={{ cursor: "default" }}
                          >
                            Present
                          </button>
                          <button
                            className={`status-btn absent-btn ${record.status === "absent" ? "active" : ""}`}
                            disabled
                            style={{ cursor: "default" }}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {viewFilteredAttendance.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No attendance records found.</div>
                    )}

                    {/* Summary */}
                    <div className="summary" style={{ marginTop: '20px' }}>
                      <div>Present: {viewPresentCount}</div>
                      <div>Absent: {viewAbsentCount}</div>
                      <div>Total: {viewFilteredAttendance.length}</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;