const { generateUBIT, setCookie } = require("../utils/util");

const userAgent = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    let ubit = cookies?.ubit;
    if (!cookies?.ubit) {
      ubit = await generateUBIT();
      setCookie(res, "ubit", ubit, 365);
    }
    req.client = ubit;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { userAgent };
