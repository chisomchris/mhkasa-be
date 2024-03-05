const allowedOrigins = [
  "https://localhost:3000",
  "https://192.168.43.52:3000",
  "https://mhkasa-fe.vercel.app/",
];

const ROLES_LIST = {
  Admin: 5151,
  Editor: 2121,
  User: 1111,
};

const OTP_ACTION_LIST = {
  CreateUser: 1,
  ChangePassword: 2,
};

module.exports = { allowedOrigins, ROLES_LIST, OTP_ACTION_LIST };
