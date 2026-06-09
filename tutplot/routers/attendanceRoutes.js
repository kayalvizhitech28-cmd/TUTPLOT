const express = require("express");
const router = express.Router();
const { getAttendances, addAttendance } = require("../controllers/attendanceController");

router.get("/", getAttendances);
router.post("/", addAttendance);

module.exports = router;

