const express = require("express");
const db = require("../db/database");
const authenticateToken = require("../middleware/authMid");
const router = express.Router();

router.get("/search", authenticateToken, async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    if (!query) {
      return res.json({ users: [] });
    }
    const result = await db.query(
      `
      SELECT
        u.id,
        u.username,
        EXISTS ( SELECT 1 FROM user_follows f WHERE f.follower_id = $1 AND f.following_id = u.id)
        AS is_following
        FROM users u
        WHERE u.id <> $1
        AND u.username ILIKE $2
        ORDER BY u.username
        LIMIT 20
      `,
      [req.user.userId, `%${query}%`]
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not able to search user" });
  }
});

router.get("/following", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        u.id,
        u.username,
        f.created_at AS followed_at
        FROM user_follows f
        JOIN users u ON u.id = f.following_id
        WHERE f.follower_id = $1
        ORDER BY u.username
      `,
      [req.user.userId]
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not able to load users" });
  }
});

router.post("/:userId/follow", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({ error: "user not found" });
    }
    if (userId === req.user.userId) {
      return res.status(400).json({ error: "cannot follow yourself" });
    }
    await db.query(
      `
      INSERT INTO user_follows (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [req.user.userId, userId]
    );
    res.json({ message: "user followed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not able follow user" });
  }
});

router.delete("/:userId/follow", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    await db.query(
      `
      DELETE FROM user_follows
      WHERE follower_id = $1
        AND following_id = $2
      `,
      [req.user.userId, userId]
    );
    res.json({ message: "user unfollowed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not able to unfollow user" });
  }
});

router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId)) {
      return res.status(400).json({ error: "user not found" });
    }
    const userResult = await db.query(
      "SELECT id, username FROM users WHERE id = $1",
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "user not found" });
    }
    const result = await db.query(
      `SELECT
        r.id,
        r.created_at,
        r.region,
        ir.common_name,
        ir.scientific_name,
        ir.confidence
      FROM recordings r
      LEFT JOIN identification_results ir
        ON ir.recording_id = r.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC`,
      [userId]
    );
    const recordings = [];
    for (const row of result.rows) {
      let recording = recordings.find((item) => item.id === row.id);
      if (!recording) {
        recording = {
          id: row.id,
          created_at: row.created_at,
          location: row.region || "location not found",
          results: []
        };
        recordings.push(recording);
      }
      if (row.common_name) {
        recording.results.push({
          common_name: row.common_name,
          scientific_name: row.scientific_name,
          confidence: row.confidence
        });
      }
    }
    res.json({ user: userResult.rows[0], recordings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not able to load user" });
  }
});

module.exports = router;