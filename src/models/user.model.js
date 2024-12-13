/**
 * The User schema is the abstract representation of
 * an application user.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const { EMAIL_REGEX } = require("../resources/validationRegExp");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, validationErrorMessages.USERNAME_UNIQUE],
      maxLength: [20, validationErrorMessages.USERNAME_MAX_LENGTH],
      minLength: [3, validationErrorMessages.USERNAME_MIN_LENGTH],
      trim: true,
    },
    email: {
      type: String,
      match: [EMAIL_REGEX, validationErrorMessages.EMAIL_INVALID],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
