import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./timetable.css";
import Sidebar from "./sidebar";  

function Timetable() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("add"); // "add" or "view"
  const [filterClass, setFilterClass] = useState("10th"); // default to 10th
  
  // State for fetched DB data
  const [dbTimetables, setDbTimetables] = useState([]);

  // State for Add form
  const [addClass, setAddClass] = useState("10th");
  const [addGroup, setAddGroup] = useState("");
  const [scheduleData, setScheduleData] = useState([
    { day: "Monday", subject_code: "", subject: "", staff: "" },
    { day: "Tuesday", subject_code: "", subject: "", staff: "" },
    { day: "Wednesday", subject_code: "", subject: "", staff: "" },
    { day: "Thursday", subject_code: "", subject: "", staff: "" },
    { day: "Friday", subject_code: "", subject: "", staff: "" },
    { day: "Saturday", subject_code: "", subject: "", staff: "" }
  ]);

  useEffect(() => {
    if (viewMode === "view") {
      fetch("https://tutplot.onrender.com/api/timetable")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setDbTimetables(data);
            if (data.length > 0) {
              // Update default filter to the first available class_name if not already set correctly
              const uniqueClasses = Array.from(new Set(data.map(t => t.class_name)));
              if (!uniqueClasses.includes(filterClass)) {
                setFilterClass(uniqueClasses[0]);
              }
            }
          } else {
            console.error("Timetable data is not an array", data);
            setDbTimetables([]);
          }
        })
        .catch(err => console.error("Failed to fetch timetables", err));
    }
  }, [viewMode]);

  const handleInputChange = (index, field, value) => {
    const updatedSchedule = [...scheduleData];
    updatedSchedule[index][field] = value;
    
    // Auto-generate subject code when subject changes
    if (field === "subject") {
      if (value.trim().length > 0) {
        const subjectShort = value.substring(0, 3).toUpperCase();
        const classNum = addClass.replace(/\D/g, ""); // "10th" -> "10"
        updatedSchedule[index]["subject_code"] = `${subjectShort}${classNum}01`;
      } else {
        updatedSchedule[index]["subject_code"] = "";
      }
    }

    setScheduleData(updatedSchedule);
  };

  const handleSave = async () => {
    try {
      const finalClassName = addGroup.trim() ? `${addClass} - ${addGroup.trim()}` : addClass;
      const payload = {
        class_name: finalClassName,
        schedule: scheduleData
      };
      
      const response = await fetch("https://tutplot.onrender.com/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert("Time Table Saved Successfully!");
        setViewMode("view");
        // Reset form
        setScheduleData([
          { day: "Monday", subject_code: "", subject: "", staff: "" },
          { day: "Tuesday", subject_code: "", subject: "", staff: "" },
          { day: "Wednesday", subject_code: "", subject: "", staff: "" },
          { day: "Thursday", subject_code: "", subject: "", staff: "" },
          { day: "Friday", subject_code: "", subject: "", staff: "" },
          { day: "Saturday", subject_code: "", subject: "", staff: "" }
        ]);
      } else {
        alert("Error saving timetable");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving timetable");
    }
  };

  // Filter DB data for selected class and sort by day order
  const dayOrder = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };
  const currentTimetable = dbTimetables
    .filter(row => row.class_name === filterClass)
    .sort((a, b) => (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99));

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="toggle-header">
          <h1>TIME TABLE</h1>
          <div className="toggle-buttons">
            <button 
              className={`toggle-btn ${viewMode === "add" ? "active" : ""}`}
              onClick={() => setViewMode("add")}
            >
              Edit Time Table
            </button>
            <button 
              className={`toggle-btn ${viewMode === "view" ? "active" : ""}`}
              onClick={() => setViewMode("view")}
            >
              View Time Table
            </button>
          </div>
        </div>

        {viewMode === "add" ? (
          <div className="timetable-container">
            <div className="filter-bar" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Class: </label>
              <select value={addClass} onChange={(e) => setAddClass(e.target.value)} style={{ padding: '8px', borderRadius: '4px', marginRight: '20px' }}>
                <option value="10th">10th Standard</option>
                <option value="11th">11th Standard</option>
                <option value="12th">12th Standard</option>
              </select>

              <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Group/Section (Optional): </label>
              <input 
                type="text" 
                value={addGroup} 
                onChange={(e) => setAddGroup(e.target.value)} 
                placeholder="e.g. Bio-Maths" 
                style={{ padding: '8px', borderRadius: '4px' }} 
              />
            </div>
            
            <table className="timetable">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Subject Code</th>
                  <th>Subjects</th>
                  <th>Handling Staff</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.day}</td>
                    <td>
                      <input 
                        type="text" 
                        className="timetable-input" 
                        placeholder="Code" 
                        value={row.subject_code}
                        onChange={(e) => handleInputChange(index, 'subject_code', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="timetable-input" 
                        placeholder="Subject" 
                        value={row.subject}
                        onChange={(e) => handleInputChange(index, 'subject', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="timetable-input" 
                        placeholder="Staff" 
                        value={row.staff}
                        onChange={(e) => handleInputChange(index, 'staff', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <button className="confirm-btn-lite" onClick={handleSave}>CONFIRM</button>
            </div>
          </div>
        ) : (
          <div className="view-container">
            <div className="filter-bar">
              <label>Select Timetable: </label>
              <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                {Array.from(new Set(dbTimetables.map(t => t.class_name))).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Subject Code</th>
                  <th>Subject</th>
                  <th>Handling Staff</th>
                </tr>
              </thead>
              <tbody>
                {currentTimetable.length > 0 ? (
                  currentTimetable.map((row, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 600 }}>{row.day}</td>
                      <td>{row.subject_code}</td>
                      <td>{row.subject}</td>
                      <td>{row.staff}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No timetable found for this class.</td>
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

export default Timetable;


