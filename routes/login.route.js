const { Router } = require("express");
const { handleLogin } = require("../controllers/auth.controller");
const router = Router();

router.route("/").post(handleLogin);

module.exports = router;
