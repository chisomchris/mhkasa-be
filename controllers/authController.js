const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateAccess, generateRefresh } = require("../utils/jwtToken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username,password)
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password are required." });
  }
  // find user
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) {
    return res.sendStatus(401);
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser?.roles).filter((role) => !!role);
    const accessToken = generateAccess({
      UserInfo: {
        username: foundUser.username,
        roles,
      },
    });
    const refreshToken = generateRefresh({ username: foundUser.username });

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
      .json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

const handlePasswordChange = async (req, res) => {
  try {
    const { username, password, otp } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) {
      return res.sendStatus(401);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    foundUser.password = hashedPassword;
    await foundUser.save();

    if (result) {
      return res.status(204).json({ success: `Password changed succesfully` });
    } else {
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleLogin, handlePasswordChange };
