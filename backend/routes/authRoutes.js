const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/database");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Email does not have a valid format" });
  }

  if (password.length < 8) {
    return res.status(400).json({error: "password needs to be at least 8 hars long" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );

    res.status(201).json({ message: "user registered", user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to register user"
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "No user matching credentials was found" });
    }
    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );
    if (!passwordMatches) {
      return res.status(401).json({ error: "No user matching credentials was found" });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "12h" }
    );
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;