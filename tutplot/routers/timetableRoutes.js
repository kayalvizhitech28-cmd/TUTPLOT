const express = require("express");
const router = express.Router();
const { getTimetables, addTimetable } = require("../controllers/timetableController");

router.get("/", getTimetables);
router.post("/", addTimetable);

module.exports = router;
