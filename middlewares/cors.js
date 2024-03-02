const cors = require("cors");
const { allowedOrigins } = require("../utils/config");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, { origin: true });
    } else {
      callback(new Error("Domian not allowed", { origin: false }));
    }
  },
  optionSuccessStatus: 200,
  credentials: true,
};

const useCors = () => cors(corsOptions);

module.exports = useCors;
