import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";   
import "./ExamsMarks.css"; 

function ExamsMarks() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("add"); // "add" or "view"
  const [filterClass, setFilterClass] = useState("All");
  const [filterExam, setFilterExam] = useState("All");

  // State for fetched DB data
  const [dbMarks, setDbMarks] = useState([]);

  useEffect(() => {
    if (viewMode === "view") {
      fetch("http://localhost:3000/api/exams")
        .then(res => res.json())
        .then(data => {
          const mappedData = (data || []).map(s => {
            return {
              id: s.id || Math.random(),
              name: s.name || s.student_name || "N/A",
              class: s.class || s.class_name || "N/A",
              exam: s.exam || s.exam_name || "N/A",
              subjects: s.subjects || [],
            };
          });
          setDbMarks(mappedData);
        })
        .catch(err => console.error("Failed to fetch marks", err));
    }
  }, [viewMode]);

  const filteredMarks = dbMarks.filter(s => {
    const matchClass = filterClass === "All" || s.class === filterClass;
    const matchExam = filterExam === "All" || s.exam === filterExam;
    return matchClass && matchExam;
  });

  const [examData, setExamData] = useState({
    student: "",
    class_name: "10th",
    exam: "",
    date: "",
  });

  const [subjects, setSubjects] = useState([
    { subject: "", code: "", mark: "" },
    { subject: "", code: "", mark: "" },
    { subject: "", code: "", mark: "" },
    { subject: "", code: "", mark: "" },
    { subject: "", code: "", mark: "" }
  ]);

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [allTimetables, setAllTimetables] = useState([]);
  const [availableClasses, setAvailableClasses] = useState(["10th", "11th", "12th"]);

  useEffect(() => {
    fetch("http://localhost:3000/api/timetable")
      .then(res => res.json())
      .then(data => {
        setAllTimetables(data);
        const uniqueClasses = Array.from(new Set(data.map(d => d.class_name)));
        if (uniqueClasses.length > 0) {
          setAvailableClasses(uniqueClasses);
          if (!uniqueClasses.includes(examData.class_name)) {
            setExamData(prev => ({ ...prev, class_name: uniqueClasses[0] }));
          }
        }
      })
      .catch(err => console.error("Failed to fetch timetable", err));
  }, []);

  useEffect(() => {
    if (allTimetables.length > 0) {
      const classSubjects = allTimetables.filter(d => d.class_name === examData.class_name);
      const uniqueSubs = [];
      const seen = new Set();
      classSubjects.forEach(s => {
        if (s.subject && !seen.has(s.subject)) {
          seen.add(s.subject);
          uniqueSubs.push({ name: s.subject, code: s.subject_code });
        }
      });
      setAvailableSubjects(uniqueSubs);
    }
  }, [examData.class_name, allTimetables]);

  function handleChange(e) {
    setExamData({
      ...examData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubjectSelect(index, e) {
    const selectedSub = availableSubjects.find(s => s.name === e.target.value);
    const updatedSubjects = [...subjects];
    updatedSubjects[index].subject = selectedSub ? selectedSub.name : "";
    updatedSubjects[index].code = selectedSub ? selectedSub.code : "";
    setSubjects(updatedSubjects);
  }

  function handleSubjectChange(index, field, value) {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  }

  function addSubjectRow() {
    setSubjects([...subjects, { subject: "", code: "", mark: "" }]);
  }

  async function handleSubmit() {
    try {
      const payload = {
        ...examData,
        subjects: subjects
      };

      const response = await fetch("http://localhost:3000/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert("Marks saved successfully!");
        navigate("/attendance");
      } else {
        alert("Error saving marks");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving marks");
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="toggle-header">
          <h1>EXAMS & MARKS</h1>
          <div className="toggle-buttons">
            <button 
              className={`toggle-btn ${viewMode === "add" ? "active" : ""}`}
              onClick={() => setViewMode("add")}
            >
              Enter Marks
            </button>
            <button 
              className={`toggle-btn ${viewMode === "view" ? "active" : ""}`}
              onClick={() => setViewMode("view")}
            >
              View Marks
            </button>
          </div>
        </div>

        {viewMode === "add" ? (
          <>
            <div className="top-bar">
              <input type="text" name="student" placeholder="Student Name" value={examData.student} onChange={handleChange} />
              <select name="class_name" value={examData.class_name} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px' }}>
                {availableClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input type="text" name="exam" placeholder="Exam Name" value={examData.exam} onChange={handleChange} />
              <input type="date" name="date" value={examData.date} onChange={handleChange} />
            </div>

            <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              {subjects.map((sub, idx) => (
                <div className="form-row" key={idx} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '500px' }}>
                  <select 
                    value={sub.subject} 
                    onChange={(e) => handleSubjectSelect(idx, e)} 
                    style={{ flex: 1, padding: '8px', borderRadius: '4px' }}
                  >
                    <option value="">Select Subject</option>
                    {availableSubjects.map((s, i) => (
                      <option key={i} value={s.name}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                  <input type="number" placeholder="Mark" value={sub.mark} onChange={(e) => handleSubjectChange(idx, 'mark', e.target.value)} style={{ width: '80px', padding: '8px' }} />
                </div>
              ))}
              <button 
                type="button" 
                onClick={addSubjectRow} 
                style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                +
              </button>
            </div>

            <button className="save-btn" onClick={handleSubmit}>
              SAVE
            </button>
          </>
        ) : (
          <div className="view-container">
            <div className="filter-bar">
              <label>Filter by Class: </label>
              <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                <option value="All">All Classes</option>
                {availableClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label style={{ marginLeft: "15px" }}>Filter by Exam: </label>
              <select value={filterExam} onChange={(e) => setFilterExam(e.target.value)}>
                <option value="All">All Exams</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
              </select>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Exam</th>
                  <th>Subjects & Marks</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarks.length > 0 ? (
                  filteredMarks.map((mark) => {
                    const total = mark.subjects.reduce((sum, sub) => sum + Number(sub.mark || 0), 0);
                    return (
                      <tr key={mark.id}>
                        <td>{mark.name}</td>
                        <td><span className={`badge class-${mark.class}`}>{mark.class}</span></td>
                        <td>{mark.exam}</td>
                        <td style={{ textAlign: 'left', padding: '10px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {mark.subjects.map((sub, i) => (
                               sub.subject && (
                                 <span key={i} style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                                   <strong style={{ color: '#475569' }}>{sub.subject} 
                                     {sub.code ? <span style={{fontSize:'10px', opacity:0.7}}> ({sub.code})</span> : ''}:
                                   </strong> 
                                   <span style={{ color: 'var(--primary)', marginLeft: '6px', fontWeight: 'bold' }}>{sub.mark || 0}</span>
                                 </span>
                               )
                            ))}
                          </div>
                        </td>
                        <td style={{ fontWeight: "bold", color: "var(--primary)" }}>{total}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No marks found for this class.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamsMarks;