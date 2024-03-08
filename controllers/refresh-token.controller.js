const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateAccess } = require("../utils/jwtToken");

const handleRefreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return res.status(401).json({ message: "Invalid Token" });
    const refreshToken = cookies.jwt;
    //   find user who has the refresh token
    const foundUser = await User.findOne({
      "refreshTokens.token": refreshToken,
    });

    if (!foundUser) return res.status(403).json({ message: "Invalid token" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email)
          return res.status(403).json({ message: "Invalid token" });
        const roles = Object.values(foundUser?.roles).filter((role) => !!role);
        const accessToken = generateAccess({
          UserInfo: {
            username: decoded.username,
            email: decoded.email,
            roles,
          },
        });

        res.json({ accessToken });
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { handleRefreshToken };
