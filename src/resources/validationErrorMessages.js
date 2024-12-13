/**
 * Contains validation error messages used by mongoose-unique-validator
 * and express-validator.
 */
module.exports = {
  TITLE_REQUIRED: "Title is a required field",
  TITLE_MAX_LENGTH: "Title must be no longer than 150 characters",
  TITLE_MIN_LENGTH: "Title must be at least 3 characters long",
  BODY_REQUIRED: "Post body is a required field",
  BODY_MIN_LENGTH: "Post body must be at least 3 characters long",
  BODY_MAX_LENGTH: "The post body must be no longer than 3000 characters",
  USERNAME_REQUIRED: "Username is a required field",
  USERNAME_MAX_LENGTH: "Username must be no longer than 20 characters",
  USERNAME_MIN_LENGTH: "Username must be at least 3 characters long",
  USERNAME_UNIQUE: "Username must be unique",
  EMAIL_REQUIRED: "Email is a required field",
  EMAIL_INVALID: "Invalid email address",
  PASSWORD_REQUIRED: "Password is a required field",
  PASSWORD_IS_WEAK: `Password must be at least 7 characters long and must contain at least:
     one lowercase character, 
     one uppercase character, 
     one number, 
     and a special symbol.`,
};
