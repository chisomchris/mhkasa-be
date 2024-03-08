const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OTP_ACTION_LIST } = require("../utils/config");
const { generateRefresh } = require("../utils/jwtToken");
const { setCookie } = require("../utils/util");

const confirmOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and otp are required." });
    }
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: "User not found." });
    }
    if (foundUser.verified) {
      return res.status(409).json({ message: "User already verified." });
    }
    jwt.verify(
      foundUser?.otp,
      process.env.OTP_TOKEN_SECRET,
      async (err, decoded) => {
        if (
          err ||
          otp != decoded.code ||
          decoded.actionType != OTP_ACTION_LIST.CreateUser
        ) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
        const refreshToken = generateRefresh({
          email: foundUser.email,
          username: foundUser.username,
        });

        foundUser.verified = true;
        foundUser.otp = "";
        foundUser.refreshTokens.push({
          client: req.client,
          token: refreshToken,
        });

        const result = await foundUser.save();

        if (result) {
          setCookie(res, "jwt", refreshToken, 30);
          return res
            .status(200)
            .json({ success: `Account succesfully created` });
        } else {
          return res.status(400).json({ message: "Password reset failed" });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { confirmOtp };
