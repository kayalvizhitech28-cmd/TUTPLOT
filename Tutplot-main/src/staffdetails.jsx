import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import "./staffdetails.css";
import "./ui-buttons.css";
function Staffdetails() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("add"); // "add" or "view"
  const [filterClass, setFilterClass] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditingStaff, setIsEditingStaff] = useState(false);
  const [editStaffData, setEditStaffData] = useState(null);
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    fetch("https://tutplot.onrender.com/api/staff")
      .then(res => res.json())
      .then(data => {
        // Map database fields to frontend structure
        const mappedData = data.map(s => ({
          id: s.staff_id,
          name: s.staff_name,
          dob: s.date_of_birth ? s.date_of_birth.split('T')[0] : '', // format date properly
          address: s.address,
          emailid: s.email_id,
          qualification: s.qualification,
          specialization: s.specialization,
          handlingClass: "10th", // Default since it's not in the DB schema
          joiningdate: s.joining_date ? s.joining_date.split('T')[0] : '',
          contact: s.contact_number
        }));
        setStaffData(mappedData);
      })
      .catch(err => console.error("Failed to fetch staff", err));
  }, [viewMode]); // Refetch when view mode changes

  const filteredStaff = filterClass === "All" 
    ? staffData 
    : staffData.filter(s => s.handlingClass === filterClass);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    address: "",
    contactnumber: "",
    emailid: "",
    qualification: "",
    specialization: "",
    joiningdate: "",
  });
  const [dobInputType, setDobInputType] = useState("text");
  const [joiningInputType, setJoiningInputType] = useState("text");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://tutplot.onrender.com/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Staff Added Successfully!");
        navigate("/feesdetails");
      } else {
        alert("Error adding staff");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding staff");
    }
  };

  const isValid = (
    formData.name && formData.dob && formData.address && formData.contactnumber && formData.emailid && formData.qualification && formData.specialization && formData.joiningdate
  );

  return (
    <div className="layout">
      <Sidebar />

    <div className="main">
      <div className="toggle-header">
        <h1>STAFF DETAILS</h1>
        <div className="toggle-buttons">
          <button 
            className={`toggle-btn ${viewMode === "add" ? "active" : ""}`}
            onClick={() => setViewMode("add")}
          >
            Add Staff
          </button>
          <button 
            className={`toggle-btn ${viewMode === "view" ? "active" : ""}`}
            onClick={() => setViewMode("view")}
          >
            View Staff
          </button>
        </div>
      </div>

      {viewMode === "add" ? (
        <div className="form-container">
          <h2>Staff Details Form</h2>
          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Staff Name" onChange={handleChange} required />
            <input
              type={dobInputType}
              name="dob"
              placeholder="Date of Birth"
              value={formData.dob}
              onFocus={() => setDobInputType("date")}
              onBlur={() => { if (!formData.dob) setDobInputType("text"); }}
              onChange={handleChange}
              required
            />
            <input name="address" placeholder="Address" onChange={handleChange} required />
            <input name="contactnumber" placeholder="Contact Number" onChange={handleChange} required />
            <input name="emailid" placeholder="Email ID" onChange={handleChange} required />
            <input name="qualification" placeholder="Qualification" onChange={handleChange} required />
            <input name="specialization" placeholder="Specialization" onChange={handleChange} required />
            <input
              type={joiningInputType}
              name="joiningdate"
              placeholder="Joining Date"
              value={formData.joiningdate}
              onFocus={() => setJoiningInputType("date")}
              onBlur={() => { if (!formData.joiningdate) setJoiningInputType("text"); }}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={!isValid}>Submit</button>
          </form>
        </div>
      ) : (
        <div className="view-container">
          <div className="filter-bar">
            <label>Filter by Handling Class: </label>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="All">All Classes</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Staff Name</th>
                <th>Subject</th>
                <th>Handling Class</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} onClick={() => setSelectedStaff(staff)} className="clickable-row">
                    <td>{staff.id}</td>
                    <td>{staff.name}</td>
                    <td>{staff.specialization}</td>
                    <td><span className={`badge class-${staff.handlingClass}`}>{staff.handlingClass}</span></td>
                    <td>{staff.contact}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">No staff found for this class.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {selectedStaff && (
      <div className="modal-overlay" onClick={() => setSelectedStaff(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>Staff Details</h2>
          {!isEditingStaff ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <p><strong>ID:</strong> {selectedStaff.id}</p>
                <p><strong>Name:</strong> {selectedStaff.name}</p>
                <p><strong>DOB:</strong> {selectedStaff.dob}</p>
                <p><strong>Email:</strong> {selectedStaff.emailid}</p>
                <p><strong>Contact:</strong> {selectedStaff.contact}</p>
                <p><strong>Qualification:</strong> {selectedStaff.qualification}</p>
                <p><strong>Subject:</strong> {selectedStaff.specialization}</p>
                <p><strong>Handling Class:</strong> {selectedStaff.handlingClass}</p>
                <p><strong>Joining Date:</strong> {selectedStaff.joiningdate}</p>
                <p style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {selectedStaff.address}</p>
              </div>
              <div className="modal-actions">
                <button className="action-btn edit small" onClick={() => { setIsEditingStaff(true); setEditStaffData({
                  name: selectedStaff.name || '', dob: selectedStaff.dob || '', address: selectedStaff.address || '', contactnumber: selectedStaff.contact || '', emailid: selectedStaff.emailid || '', qualification: selectedStaff.qualification || '', specialization: selectedStaff.specialization || '', joiningdate: selectedStaff.joiningdate || ''
                })}}>Edit</button>
                <button className="action-btn delete small" onClick={async () => {
                  if (!window.confirm('Delete this staff?')) return;
                  try {
                    const res = await fetch(`https://tutplot.onrender.com/api/staff/${selectedStaff.id}`, { method: 'DELETE' });
                    if (res.ok) {
                      setStaffData(prev => prev.filter(s => s.id !== selectedStaff.id));
                      setSelectedStaff(null);
                      alert('Staff deleted');
                    } else alert('Delete failed');
                  } catch (e) { console.error(e); alert('Delete failed'); }
                }}>Delete</button>
                <button className="action-btn ghost small" onClick={() => setSelectedStaff(null)}>Close</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              <input value={editStaffData.name} onChange={(e)=>setEditStaffData({...editStaffData, name: e.target.value})} />
              <input type="date" value={editStaffData.dob} onChange={(e)=>setEditStaffData({...editStaffData, dob: e.target.value})} />
              <input value={editStaffData.address} onChange={(e)=>setEditStaffData({...editStaffData, address: e.target.value})} />
              <input value={editStaffData.contactnumber} onChange={(e)=>setEditStaffData({...editStaffData, contactnumber: e.target.value})} />
              <input value={editStaffData.emailid} onChange={(e)=>setEditStaffData({...editStaffData, emailid: e.target.value})} />
              <input value={editStaffData.qualification} onChange={(e)=>setEditStaffData({...editStaffData, qualification: e.target.value})} />
              <input value={editStaffData.specialization} onChange={(e)=>setEditStaffData({...editStaffData, specialization: e.target.value})} />
              <input type="date" value={editStaffData.joiningdate} onChange={(e)=>setEditStaffData({...editStaffData, joiningdate: e.target.value})} />
              <div className="modal-actions">
                <button className="action-btn edit" onClick={async ()=>{
                  try {
                    const res = await fetch(`https://tutplot.onrender.com/api/staff/${selectedStaff.id}`, { method: 'PUT', headers: { 'Content-Type':'application/json'}, body: JSON.stringify(editStaffData) });
                    if (res.ok) {
                      setStaffData(prev => prev.map(s => s.id === selectedStaff.id ? ({ ...s, name: editStaffData.name, dob: editStaffData.dob, address: editStaffData.address, contact: editStaffData.contactnumber, emailid: editStaffData.emailid, qualification: editStaffData.qualification, specialization: editStaffData.specialization, joiningdate: editStaffData.joiningdate }) : s));
                      setSelectedStaff(prev => ({ ...prev, name: editStaffData.name, dob: editStaffData.dob, address: editStaffData.address, contact: editStaffData.contactnumber, emailid: editStaffData.emailid, qualification: editStaffData.qualification, specialization: editStaffData.specialization, joiningdate: editStaffData.joiningdate }));
                      setIsEditingStaff(false);
                      alert('Staff updated');
                    } else alert('Update failed');
                  } catch (e) { console.error(e); alert('Update failed'); }
                }}>Save</button>
                <button className="action-btn ghost" onClick={()=>setIsEditingStaff(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

  </div>
  );
}

export default Staffdetails;

