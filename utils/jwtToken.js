require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccess = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });

const generateRefresh = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

const generateOtp = (payload) =>
  jwt.sign(payload, process.env.OTP_TOKEN_SECRET, { expiresIn: "5m" });
module.exports = { generateAccess, generateRefresh, generateOtp };
