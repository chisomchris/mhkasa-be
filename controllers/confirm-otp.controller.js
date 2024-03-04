const User = require("../models/User");
const { OTP_ACTION_LIST } = require("../utils/config");

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

    jwt.verify(
      foundUser?.otp,
      process.env.OTP_TOKEN_SECRET,
      async (err, decoded) => {
        if (
          err ||
          otp != decoded.otp ||
          decoded.actionType != OTP_ACTION_LIST.CreateUser
        )
          return res.status(403).json({ message: "Invalid or expired token" });
        foundUser.verified = true;
        const result = await foundUser.save();
        if (result) {
          return res
            .status(204)
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
