const userInfo = async (req, res, next) => {
  try {
    const email = req.email;
    const username = req.user;
    return res.status(200).json({ email, username });
  } catch (error) {
    next(error);
  }
};

module.exports = { userInfo };
