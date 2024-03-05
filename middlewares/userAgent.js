const userAgent = async (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  req.client = `${ip}-${userAgent}`;
  next();
};

module.exports = { userAgent };
