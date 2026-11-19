/* Authentication middleware to check for a valid token */
require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return res.status(401).json({ error:"authentication required"});
    }
    try{
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(403).json({ error: "Invalid token" });
    }
}
module.exports = authenticateToken; 