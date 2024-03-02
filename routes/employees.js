const { Router } = require("express");
const { getEmployees } = require("../controllers/employeesController");
const verifyRoles = require("../middlewares/verifyRoles");
const { ROLES_LIST } = require("../utils/config");
const router = Router();

router
  .route("/")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User, ROLES_LIST.Editor),
    getEmployees
  );

module.exports = router;
