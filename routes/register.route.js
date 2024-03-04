const { Router } = require("express");
const { handleRegister } = require("../controllers/register.controller");
const router = Router();

router.route("/").post(handleRegister);

module.exports = router;
