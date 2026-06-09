const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const controllersDir = path.join(__dirname, 'controllers');
const routersDir = path.join(__dirname, 'routers');

const entities = ['student', 'attendance', 'exam', 'fees', 'staff', 'timetable'];

entities.forEach(entity => {
  const capEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
  
  // Model
  const modelContent = `const { poolPromise, sql } = require("../config/db");

async function getAll${capEntity}s() {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM ${entity}");
  return result.recordset;
}

async function create${capEntity}(data) {
  const pool = await poolPromise;
  const request = pool.request();
  // TODO: Add inputs and write INSERT query based on actual schema
  const query = "INSERT INTO ${entity} DEFAULT VALUES"; // Placeholder
  return request.query(query);
}

module.exports = { getAll${capEntity}s, create${capEntity} };
`;
  fs.writeFileSync(path.join(modelsDir, `${entity}Model.js`), modelContent);

  // Controller
  const controllerContent = `const { getAll${capEntity}s, create${capEntity} } = require("../models/${entity}Model");

async function get${capEntity}s(req, res) {
  try {
    const data = await getAll${capEntity}s();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function add${capEntity}(req, res) {
  try {
    await create${capEntity}(req.body);
    res.status(201).json({ message: "${capEntity} added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { get${capEntity}s, add${capEntity} };
`;
  fs.writeFileSync(path.join(controllersDir, `${entity}Controller.js`), controllerContent);

  // Router
  const routerContent = `const express = require("express");
const router = express.Router();
const { get${capEntity}s, add${capEntity} } = require("../controllers/${entity}Controller");

router.get("/", get${capEntity}s);
router.post("/", add${capEntity});

module.exports = router;
`;
  fs.writeFileSync(path.join(routersDir, `${entity}Routes.js`), routerContent);
});

console.log("Files created successfully.");

