const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: String,

  roles: {
    user: {
      type: Number,
      default: 1111,
    },
    admin: Number,
    editor: Number,
  },

  refreshToken: String,

  verified: {
    type: Boolean,
    default: false,
  },

  otp: String,
});

module.exports = model("User", UserSchema);
