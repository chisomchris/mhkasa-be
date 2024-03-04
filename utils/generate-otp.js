const getOtp = (length = 6) => {
  let otp = "";
  const codes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < length; i++) {
    otp += codes[Math.floor(Math.random() * codes.length)];
  }

  return otp;
};

module.exports = { getOtp };
