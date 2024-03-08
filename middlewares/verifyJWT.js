require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(403).json({ message: "Invalid Token" });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      req.user = decoded.UserInfo.username;
      req.email = decoded.UserInfo.email;
      req.roles = decoded.UserInfo.roles;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyJWT;
