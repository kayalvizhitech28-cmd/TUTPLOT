const express = require("express");
const router = express.Router();
const { getStaffs, addStaff, editStaff, removeStaff } = require("../controllers/staffController");

router.get("/", getStaffs);
router.post("/", addStaff);
router.put("/:id", editStaff);
router.delete("/:id", removeStaff);

module.exports = router;

