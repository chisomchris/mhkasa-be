const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateOtp } = require("../utils/jwtToken");
const { getOtp } = require("../utils/generate-otp");
const { OTP_ACTION_LIST } = require("../utils/config");

const handleRegister = async (req, res, next) => {
  // register new user
  const { username, password, email, phone } = req.body;
  if (!username || !password || !email || !phone)
    return res
      .status(400)
      .json({ message: "Username , Email and password are required." });

  // check for duplicate
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate)
    return res.status(409).json({ message: "Email already in use." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // generate otp
    const otpCode = getOtp(4);

    const otp = generateOtp({
      code: otpCode,
      actionType: OTP_ACTION_LIST.CreateUser,
    });

    const result = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      phone,
    });

    if (result) {
      // send otp to user email address
      return res
        .status(201)
        .json({ success: `New user ${username} created`, otpCode });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { handleRegister };
