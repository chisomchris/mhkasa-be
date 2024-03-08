const User = require("../models/User");
const { generateOtp } = require("../utils/jwtToken");
const { getOtp } = require("../utils/generate-otp");
const { OTP_ACTION_LIST } = require("../utils/config");

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.status(404).json({ message: "User not found" });
  if (!foundUser.verified) {
    return res.status(403).json({ message: "User unverified" });
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
    next(error);
  }
};

module.exports = { forgotPassword };
