const express = require("express");
const router = express.Router();
const { signup, login, listUsers, logout } = require("../controllers/authcontroller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/users", listUsers);

module.exports = router;
