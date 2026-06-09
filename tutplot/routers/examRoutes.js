const express = require("express");
const router = express.Router();
const { getExams, addExam } = require("../controllers/examController");

router.get("/", getExams);
router.post("/", addExam);

module.exports = router;

