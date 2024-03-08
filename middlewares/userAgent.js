const { generateUBIT, setCookie } = require("../utils/util");

const userAgent = async (req, res, next) => {
  try {
    let ubit;
    const { mode } = req.headers;
    if (mode === "private") {
      ubit = "incognito";
    } else {
      ubit = req.cookies?.ubit;
      if (!ubit) {
        ubit = await generateUBIT();
        setCookie(res, "ubit", ubit, 365);
      }
    }
    req.client = ubit;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { userAgent };
