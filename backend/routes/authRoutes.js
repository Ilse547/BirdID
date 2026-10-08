const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/database");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "we need username, email and password" });
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
      error: "faild to register user"
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "user not found" });
    }
    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );
    if (!passwordMatches) {
      return res.status(401).json({ error: "user not found" });
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "12h" }
    );
    res.json({ message: "login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "login did not work" });
  }
});

module.exports = router;