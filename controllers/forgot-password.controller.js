const User = require("../models/User");
const { generateOtp } = require("../utils/jwtToken");
const { getOtp } = require("../utils/generate-otp");
const { OTP_ACTION_LIST } = require("../utils/config");

const forgotPassword = async (req, res) => {
  // register new user
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  // check for duplicate
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.sendStatus(404);

  if (!foundUser.verified) {
    return res.status(403).json({ message: "User unverified." });
  }

  try {
    // generate otp
    const otpCode = getOtp(4);

    const otp = generateOtp({
      code: otpCode,
      actionType: OTP_ACTION_LIST.ChangePassword,
    });

    foundUser.otp = otp;

    const result = await foundUser.save();
    if (result) {
      // send otp to user email address
      return res.status(200).json({ message: `OTP sent to ${email}`, otpCode });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { forgotPassword };
