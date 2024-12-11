/**
 * Contains regular expressions used in validation
 * by mongoose-unique-validator.
 */
module.exports = {
  PASSWORD_REGEX: RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
  EMAIL_REGEX: RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
};
