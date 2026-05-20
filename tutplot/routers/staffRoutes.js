const express = require("express");
const router = express.Router();
const { getStaffs, addStaff } = require("../controllers/staffController");

router.get("/", getStaffs);
router.post("/", addStaff);

module.exports = router;
