const { getAllStaffs, createStaff, updateStaff, deleteStaff } = require("../models/staffModel");

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

async function editStaff(req, res) {
  try {
    const { id } = req.params;
    await updateStaff(id, req.body);
    res.status(200).json({ message: "Staff updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function removeStaff(req, res) {
  try {
    const { id } = req.params;
    await deleteStaff(id);
    res.status(200).json({ message: "Staff deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { getStaffs, addStaff, editStaff, removeStaff };

