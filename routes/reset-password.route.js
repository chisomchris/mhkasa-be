const { Router } = require("express");
const { handlePasswordChange } = require("../controllers/auth.controller");
const router = Router();

router.route("/").post(handlePasswordChange);

module.exports = router;
