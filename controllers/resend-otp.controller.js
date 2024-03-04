const User = require("../models/User");
const { generateOtp } = require("../utils/jwtToken");
const { OTP_ACTION_LIST } = require("../utils/config");
const { getOtp } = require("../utils/generate-otp");

const resendOtp = async (req, res) => {
  try {
    const { email, actionType } = req.body;
    if (!email || !actionType) {
      return res
        .status(400)
        .json({ message: "email and actionType are required." });
    }

    if (!Object.values(OTP_ACTION_LIST).includes(actionType)) {
      return res.status(400).json({ message: "Invalid actionType" });
    }

    // find user
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(404).json({ message: "email not found." });
    }

    const otpCode = getOtp(4);
    const payload = { otp: otpCode, actionType };
    const otp = generateOtp(payload);

    foundUser.otp = otp;

    const result = await foundUser.save();

    if (result) {
      // send otp & link to email address here
      return res.status(200).json({ success: `OTP sent.` });
    } else {
      res.status(400).json({ message: "Unable to send otp" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { resendOtp };
