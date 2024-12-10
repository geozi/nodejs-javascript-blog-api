/**
 * Contains validation error messages used by mongoose-unique-validator
 * and express-validator.
 */
module.exports = {
  TITLE_REQUIRED: "Title is a required field",
  TITLE_MAX_LENGTH: "Title must be no longer than 150 characters",
  BODY_REQUIRED: "Post body is a required field",
  BODY_MAX_LENGTH: "The post body must be no longer than 3000 characters",
  USERNAME_REQUIRED: "Username is a required field",
  USERNAME_MAX_LENGTH: "Username must be no longer than 20 characters",
  USERNAME_MIN_LENGTH: "Username must be at least 3 characters long",
  USERNAME_UNIQUE: "Username must be unique",
  EMAIL_REQUIRED: "Email is a required field",
  EMAIL_INVALID: "Invalid email address",
  PASSWORD_REQUIRED: "Password is a required field",
  PASSWORD_MUST_HAVE_CHARACTERS:
    "Password must contain at least one lowercase character, one uppercase character, one number, and a special symbol.",
};
