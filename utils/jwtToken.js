require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccess = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
const generateRefresh = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

module.exports = { generateAccess, generateRefresh };
