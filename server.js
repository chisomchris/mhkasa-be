const express = require("express");
const cookieParser = require("cookie-parser");
const useCors = require("./middlewares/cors");
const catchAll = require("./middlewares/catchAll");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const connectDB = require("./utils/dbConnection");
const verifyJWT = require("./middlewares/verifyJWT");
const credentials = require("./middlewares/credentials");

const app = express();
// parse cookie sent along side requests
app.use(cookieParser());
// set credentials header for request origin on white list
app.use(credentials);
// allow cross-origin-resource-sharing from allowed origin
app.use(useCors());
// parse request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/v1/logout", require("./routes/logout.route"));
app.use("/v1/refresh", require("./routes/refresh.route"));
app.use("/v1/login", require("./routes/login.route"));
app.use("/v1/register", require("./routes/register.route"));
app.use("/v1/confirm-otp", require("./routes/confirm-otp.route"));
app.use("/v1/resend-otp", require("./routes/resend-otp.route"));
app.use("/v1/forgot-password", require("./routes/forgot-password.route"));
app.use("/v1/reset-password", require("./routes/reset-password.route"));
app.use(verifyJWT);
app.use("/v1/user-info", require("./routes/user-info.route"));
app.use("/v1/employees", require("./routes/employees.route"));

app.all("*", catchAll);

app.use(errorHandler);

connectDB().then((connection) => {
  if (connection) {
    startServer();
  }
});

function startServer() {
  if (process.env.ENVIRONMENT === "development") {
    const https = require("https");
    const fs = require("fs");
    const options = {
      key: fs.readFileSync("./cert/localhost.key"),
      cert: fs.readFileSync("./cert/localhost.crt"),
    };
    https.createServer(options, app).listen(PORT, () => {
      console.log(`Dev server running on port:${PORT}`);
    });
  }
  if (process.env.ENVIRONMENT === "production") {
    app.listen(PORT, () => {
      console.log(`Production server running on port:${PORT}`);
    });
  }
}
