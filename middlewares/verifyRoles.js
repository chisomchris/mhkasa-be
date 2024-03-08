const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req?.roles)
        return res.status(403).json({ message: "Unauthorized Request" });
      const rolesArray = [...allowedRoles];
      const isAllowed = req.roles
        .map((role) => rolesArray.includes(role))
        .find((val) => val === true);

      if (!isAllowed)
        return res.status(403).json({ message: "Unauthorized Request" });
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = verifyRoles;
