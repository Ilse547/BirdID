require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return res.status(401).json({ error:"authenticatiob required"});
    }
    try{
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(403).json({ error: "invalitoken is not validd" });
    }
}
module.exports = authenticateToken; 