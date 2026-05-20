const { getAllStaffs, createStaff } = require("../models/staffModel");

async function getStaffs(req, res) {
  try {
    const data = await getAllStaffs();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function addStaff(req, res) {
  try {
    await createStaff(req.body);
    res.status(201).json({ message: "Staff added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { getStaffs, addStaff };
