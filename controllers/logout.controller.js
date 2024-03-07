const User = require("../models/User");
const { setCookie } = require("../utils/util");
const handleLogout = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    //   find user who has the refresh token
    const foundUser = await User.findOne({
      "refreshTokens.token": refreshToken,
    });

    if (!foundUser) {
      setCookie(res, "jwt", "", 0);
      return res.sendStatus(204);
    }
    // delete refresh token in DB
    const userIndex = foundUser.refreshTokens.findIndex(
      (x) => x?.token === refreshToken
    );

    foundUser.refreshTokens[userIndex].token = "";

    const result = await foundUser.save();

    if (result) {
      setCookie(res, "jwt", "", 0);
      return res.sendStatus(204);
    } else {
      res.sendStatus(400).json({ message: "User not logged out" });
    }
  } catch (error) {
    next(error);
  }
};

const handleLogoutFromAllDevices = async (req, res) => {
  // const token = req.params;
};

module.exports = { handleLogout, handleLogoutFromAllDevices };
