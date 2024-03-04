const userInfo = async (req, res) => {
  try {
    const email = req.email;
    const username = req.user;
    return res.status(200).json({ email, username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { userInfo };
