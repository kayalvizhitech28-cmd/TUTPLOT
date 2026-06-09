const { getAllTimetables, createTimetable } = require("../models/timetableModel");

async function getTimetables(req, res) {
  try {
    const data = await getAllTimetables();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function addTimetable(req, res) {
  try {
    await createTimetable(req.body);
    res.status(201).json({ message: "Timetable added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { getTimetables, addTimetable };

