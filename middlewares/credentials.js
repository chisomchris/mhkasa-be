const { allowedOrigins } = require("../utils/config");

const credentials = (req, res, next) => {
  try {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Credentials", true);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = credentials;
