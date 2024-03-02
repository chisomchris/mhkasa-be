const allowedOrigins = [
  "https://localhost:3000",
  "https://192.168.43.52:3000",
];

const ROLES_LIST = {
  Admin: 5151,
  Editor: 2121,
  User: 1111,
};
module.exports = { allowedOrigins, ROLES_LIST };
