import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import "./attendance.css";

function Attendance() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    standard: "",
    group: "",
    date: "",
    staff: "",
  });

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("add"); // "add" or "view"
  const [filterClass, setFilterClass] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [dbAttendance, setDbAttendance] = useState([]);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dateInputType, setDateInputType] = useState("text");
  const [filterDateInputType, setFilterDateInputType] = useState("text");

  const [students, setStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    if (viewMode === "view") {
      fetch("http://localhost:3000/api/attendance")
        .then(res => res.json())
        .then((data) => {
          setDbAttendance(data);

          if (data && data.length > 0 && !filtersInitialized) {
            const latest = data.reduce((latestRow, currentRow) => {
              const latestDate = latestRow?.date ? new Date(latestRow.date) : null;
              const currentDate = currentRow?.date ? new Date(currentRow.date) : null;
              if (!latestDate || (currentDate && currentDate > latestDate)) {
                return currentRow;
              }
              return latestRow;
            }, null);

            if (latest) {
              setFilterClass(latest.standard || "");
              setFilterGroup(latest.group || latest.Group || "");
              setFilterDate(latest.date ? new Date(latest.date).toISOString().split("T")[0] : "");
              setFiltersInitialized(true);
            }
          }
        })
        .catch(err => console.error("Failed to fetch attendance", err));
    }
  }, [viewMode, filtersInitialized]);

  useEffect(() => {
    if (viewMode !== "view") {
      setFiltersInitialized(false);
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
        if (form.group && form.group.trim()) {
          filtered = filtered.filter(s => {
            const sg = (s.Group || s.group || s.group_name || s.groupName || "");
            return String(sg) === String(form.group);
          });
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

  useEffect(() => {
    // load staff list for handling staff dropdown
    fetch("http://localhost:3000/api/staff")
      .then(res => res.json())
      .then(data => setStaffList(data || []))
      .catch(err => console.error("Failed to load staff", err));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    // If class/standard changes, reset student selection so dropdown shows only that class
    if (name === "standard") {
      setSearch("");
      // clear group when changing class
      setForm(prev => ({ ...prev, group: "" }));
    }
    if (name === "group") {
      setSearch("");
    }
    setForm({ ...form, [name]: value });
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
    setErrorMessage("");

    if (!form.standard) {
      setErrorMessage("Please select a class before submitting.");
      return;
    }

    if (!form.date) {
      setErrorMessage("Please enter the attendance date before submitting.");
      return;
    }

    if (!form.staff.trim()) {
      setErrorMessage("Please enter the handling staff name before submitting.");
      return;
    }

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
            type={dateInputType}
            name="date"
            placeholder="Date"
            value={form.date}
            onFocus={() => setDateInputType("date")}
            onBlur={() => { if (!form.date) setDateInputType("text"); }}
            onChange={handleChange}
          />

          <select
            name="staff"
            value={form.staff}
            onChange={handleChange}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            <option value="">Select Handling Staff</option>
            {staffList.map((s) => (
              <option key={s.staff_id || s.id || s.email_id} value={s.staff_name || s.staff_name}>
                {s.staff_name}
              </option>
            ))}
          </select>
            {(form.standard === "11" || form.standard === "12") && (
              <input
                type="text"
                name="group"
                placeholder="Group"
                value={form.group}
                onChange={handleChange}
                style={{ padding: '8px', borderRadius: '4px' }}
              />
            )}
        </div>

        {/* Controls */}
        <div className="controls">
          <select
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

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

        {errorMessage && (
          <div style={{ color: "#b91c1c", marginBottom: "12px" }}>{errorMessage}</div>
        )}

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!form.standard || !form.date || !form.staff.trim()}
              style={{ opacity: !form.standard || !form.date || !form.staff.trim() ? 0.6 : 1, cursor: !form.standard || !form.date || !form.staff.trim() ? "not-allowed" : "pointer" }}
            >
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
              <input
                type="text"
                value={filterGroup}
                placeholder="Group"
                onChange={(e) => setFilterGroup(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px' }}
              />
              <input
                type={filterDateInputType}
                value={filterDate}
                placeholder="Date"
                onFocus={() => setFilterDateInputType("date")}
                onBlur={() => { if (!filterDate) setFilterDateInputType("text"); }}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px' }}
              />
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
                const getRecordGroup = (r) => (r.group || r.Group || r.group_name || r.groupName || "");
                const viewFilteredAttendance = dbAttendance.filter(a => {
                  const classMatch = !filterClass || String(a.standard) === String(filterClass);
                  const dateMatch = !filterDate || (a.date && new Date(a.date).toISOString().split('T')[0] === filterDate);
                  const groupMatch = !filterGroup || String(getRecordGroup(a)) === String(filterGroup);
                  return classMatch && dateMatch && groupMatch;
                });
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