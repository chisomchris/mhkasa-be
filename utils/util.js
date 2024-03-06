const crypto = require("crypto");

const generateUBIT = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, (err, buffer) => {
      if (err) {
        reject(err);
      } else resolve(buffer.toString("hex"));
    });
  });
};

const setCookie = (res, key, value = "", maxAge = 7) => {
  const now = Date.now();
  const cookieString = `${key}=${value};HttpOnly;Secure;Partitioned;SameSite=None;Path=/;Max-Age=${
    maxAge * 24 * 60 * 60 * 1000
  };Expires=${new Date(now + maxAge * 24 * 60 * 60 * 1000)}`;

  res.setHeader("Set-Cookie", cookieString);
};

module.exports = { generateUBIT, setCookie };
