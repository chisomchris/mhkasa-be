const { Router } = require("express");
const { confirmOtp } = require("../controllers/confirm-otp.controller");
const router = Router();

router.route("/").post(confirmOtp);

module.exports = router;
