const { getAllStudents, createStudent, updateStudent, deleteStudent } = require("../models/studentModel");

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

async function editStudent(req, res) {
  try {
    const { id } = req.params;
    await updateStudent(id, req.body);
    res.status(200).json({ message: "Student updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function removeStudent(req, res) {
  try {
    const { id } = req.params;
    await deleteStudent(id);
    res.status(200).json({ message: "Student deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { getStudents, addStudent, editStudent, removeStudent };

