const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OTP_ACTION_LIST } = require("../utils/config");
const { generateRefresh } = require("../utils/jwtToken");

const confirmOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and otp are required." });
    }
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.sendStatus(401);
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
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        if (result) {
          return res
            .cookie("jwt", refreshToken, {
              httpOnly: true,
              maxAge: 30 * 24 * 60 * 60 * 1000,
              sameSite: "None",
              secure: true,
            })
            .status(200)
            .json({ success: `Account succesfully created` });
        } else {
          return res.status(400).json({ message: "Password reset failed" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { confirmOtp };
