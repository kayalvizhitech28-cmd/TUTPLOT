const { getAllStudents, createStudent } = require("../models/studentModel");

async function getStudents(req, res) {
  try {
    const data = await getAllStudents();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function addStudent(req, res) {
  try {
    await createStudent(req.body);
    res.status(201).json({ message: "Student added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { getStudents, addStudent };
