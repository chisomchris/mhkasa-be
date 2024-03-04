const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccess, generateRefresh } = require("../utils/jwtToken");
const { OTP_ACTION_LIST } = require("../utils/config");

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }
    // find user
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.sendStatus(401);
    }
    if (!foundUser.verified) {
      return res.status(401).json({ message: "User not verified" });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const roles = Object.values(foundUser?.roles).filter((role) => !!role);
      const accessToken = generateAccess({
        UserInfo: {
          username: foundUser.username,
          email: foundUser.email,
          roles,
        },
      });
      const refreshToken = generateRefresh({
        email: foundUser.email,
        username: foundUser.username,
      });

      foundUser.refreshToken = refreshToken;

      await foundUser.save();

      res
        .cookie("jwt", refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "None",
          secure: true,
        })
        .status(200)
        .json({
          email: foundUser.email,
          username: foundUser.username,
          accessToken,
        });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handlePasswordChange = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    if (!email || !password || !otp) {
      return res
        .status(400)
        .json({ message: "email and password are required." });
    }
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.sendStatus(401);
    }

    jwt.verify(
      foundUser?.otp,
      process.env.OTP_TOKEN_SECRET,
      async (err, decoded) => {
        if (
          err ||
          otp != decoded.code ||
          decoded.actionType != OTP_ACTION_LIST.ChangePassword
        )
          return res.status(403).json({ message: "Invalid or expired token" });
        const hashedPassword = await bcrypt.hash(password, 10);
        foundUser.password = hashedPassword;
        foundUser.otp = "";
        const result = await foundUser.save();
        if (result) {
          return res
            .status(204)
            .json({ success: `Password changed succesfully` });
        } else {
          return res.status(400).json({ message: "Password reset failed" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleLogin, handlePasswordChange };
