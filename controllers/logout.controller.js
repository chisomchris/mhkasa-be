const User = require("../models/User");
const handleLogout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    //   find user who has the refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        partitioned: true,
      });
      return res.sendStatus(204);
    }
    // delete refresh token in DB
    foundUser.refreshToken = "";

    const result = await foundUser.save();
    if (result) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        partitioned: true,
      });
      return res.sendStatus(204);
    } else {
      res.sendStatus(400).json({ message: "User not logged out" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleLogout };
