const { getAllFeess, createFees } = require("../models/feesModel");

async function getFeess(req, res) {
  try {
    const data = await getAllFeess();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function addFees(req, res) {
  try {
    await createFees(req.body);
    res.status(201).json({ message: "Fees added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { getFeess, addFees };
