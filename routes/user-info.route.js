const { Router } = require("express");
const { userInfo } = require("../controllers/user-info.controller");
const router = Router();

router.route("/").get(userInfo);

module.exports = router;
