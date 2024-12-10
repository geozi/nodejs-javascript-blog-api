const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMessages = require("../config/validationErrorMessages");

const postSchema = new Schema(
  {
    title: {
      type: String,
      maxLength: [150, validationErrorMessages.TITLE_MAX_LENGTH],
    },
    body: {
      type: String,
      maxLength: [3000, validationErrorMessages.BODY_MAX_LENGTH],
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
