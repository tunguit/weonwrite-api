const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const uniqueValidator = require("mongoose-unique-validator");

const UserAuthenticationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    index: {
      unique: true
    },
    required: true
  },
  email: {
    type: String,
    index: {
      unique: [true, 'This email has already been used']
    },
    required: [true, 'Email can not be empty']
  },
  password: {
    type: String,
    required: [true, 'Password can not be empty']
  }
});

UserAuthenticationSchema.plugin(timestamps);
UserAuthenticationSchema.plugin(uniqueValidator, {
  message: "{PATH}: {VALUE} already existed."
});

module.exports = mongoose.model("UserAuthentication", UserAuthenticationSchema);
