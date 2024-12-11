const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");

const postSchema = new Schema(
  {
    title: {
      type: String,
      maxLength: [100, validationErrorMessages.TITLE_MAX_LENGTH],
      minLength: [3, validationErrorMessages.TITLE_MIN_LENGTH],
    },
    body: {
      type: String,
      maxLength: [2000, validationErrorMessages.BODY_MAX_LENGTH],
      minLength: [3, validationErrorMessages.BODY_MIN_LENGTH],
    },
    username: {
      type: String,
    },
  },
  {
    collection: "posts",
    timestamps: true,
  }
);

postSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Post", postSchema);
