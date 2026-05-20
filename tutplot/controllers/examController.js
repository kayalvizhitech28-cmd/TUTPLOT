const { getAllExams, createExam } = require("../models/examModel");

async function getExams(req, res) {
  try {
    const data = await getAllExams();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function addExam(req, res) {
  try {
    await createExam(req.body);
    res.status(201).json({ message: "Exam added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { getExams, addExam };
