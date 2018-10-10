const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const uniqueValidator = require("mongoose-unique-validator");
const uuid = require("uuid");
const UserAuthenticationModel = require("./UserAuthenticationModel");
const UserActionModel = require("./UserActionModel");

var validateEmail = function (email) {
  if (!email || email === '') {
    return true
  }
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
}

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: [true, 'Name can not Empty']
  },
  avatar: String,
  gender: String,
  birthdate: Date,
  mobile: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [validateEmail, 'Invalid email'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    required: [true, 'Email can not Empty'],
    index: {
      unique: [true, 'This email has already been used']
    }
  },
  approved: {
    type: Boolean,
    default: false
  },
  intro: String,
  totalComments: {
    type: Number,
    default: 0
  },
  user_id: String,
  average_rate: Number,
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  city: {
    type: String,
    required: false
  },
  district: {
    type: String,
    required: false
  }
});

userSchema.plugin(timestamps);
userSchema.plugin(uniqueValidator, {
  message: "{PATH}: {VALUE} already been existed."
});

userSchema.virtual("comment", {
  ref: "userComment",
  localField: "user_id",
  foreignField: "for_user_id",
  justOne: false
});

module.exports = mongoose.model("user", userSchema);