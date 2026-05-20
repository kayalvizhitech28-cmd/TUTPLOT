const { getAllAttendances, createAttendance } = require("../models/attendanceModel");

async function getAttendances(req, res) {
  try {
    const data = await getAllAttendances();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function addAttendance(req, res) {
  try {
    await createAttendance(req.body);
    res.status(201).json({ message: "Attendance added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { getAttendances, addAttendance };
