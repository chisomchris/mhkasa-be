const { Router } = require("express");
const { resendOtp } = require("../controllers/resend-otp.controller");
const router = Router();

router.route("/").post(resendOtp);

module.exports = router;
