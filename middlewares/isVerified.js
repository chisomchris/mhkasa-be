const User = require("../models/User");

const isVerified = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.verified) {
    return res.status(401).send({ message: "User not verified" });
  }

  next();
};

module.exports = { isVerified };
