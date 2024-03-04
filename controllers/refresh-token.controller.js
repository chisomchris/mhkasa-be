const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateAccess } = require("../utils/jwtToken");

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    //   find user who has the refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email)
          return res.sendStatus(403);
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
  } catch (error) {}
};

module.exports = { handleRefreshToken };
