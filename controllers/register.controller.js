const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateOtp } = require("../utils/jwtToken");
const { getOtp } = require("../utils/generate-otp");

const handleRegister = async (req, res) => {
  // register new user
  const { username, password, email, phone } = req.body;
  if (!username || !password || !email || !phone)
    return res
      .status(400)
      .json({ message: "Username , Email and password are required." });

  // check for duplicate
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) return res.sendStatus(409);

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
      password: hashedPassword,
      otp,
      phone,
    });

    if (result) {
      // send otp to user email address
      return res.status(201).json({ success: `New user ${username} created` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleRegister };
