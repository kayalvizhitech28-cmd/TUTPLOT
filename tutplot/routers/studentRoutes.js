const express = require("express");
const router = express.Router();
const { getStudents, addStudent, editStudent, removeStudent } = require("../controllers/studentController");

router.get("/", getStudents);
router.post("/", addStudent);
router.put("/:id", editStudent);
router.delete("/:id", removeStudent);

module.exports = router;

