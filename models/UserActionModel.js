const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

const userActionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    index: {
      unique: true
    }
  },
  followed_questions: [String], // will remove in future, migrated into another schema
  saved_news: [String], // will remove in future, migrated into another schema
  liked_news: [String], // will remove in future, migrated into another schema
  saved_categories: [String], // moved to user model
});

userActionSchema.plugin(timestamps);

module.exports = mongoose.model("userAction", userActionSchema);