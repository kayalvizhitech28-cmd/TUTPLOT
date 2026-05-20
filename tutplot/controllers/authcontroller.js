const { createUser, getUsers, findUserByEmail } = require("../models/userModel");

async function signup(req, res) {
  const { email, password, mobile } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    await createUser(email, password, mobile);
    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful!", user: { id: user.management_id, email: user.email_id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}

async function listUsers(req, res) {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
}

module.exports = { signup, login, listUsers };
