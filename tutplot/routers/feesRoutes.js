const express = require("express");
const router = express.Router();
const { getFeess, addFees } = require("../controllers/feesController");

router.get("/", getFeess);
router.post("/", addFees);

module.exports = router;

