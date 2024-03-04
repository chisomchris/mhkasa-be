const { Router } = require("express");
const { forgotPassword } = require("../controllers/forgot-password.controller");
const router = Router();

router.route("/").post(forgotPassword);

module.exports = router;
