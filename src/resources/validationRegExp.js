/**
 * Contains regular expressions used in validation
 * by mongoose-unique-validator.
 */

const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/
);
const EMAIL_REGEX = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
);

module.exports = {
  PASSWORD_REGEX,
  EMAIL_REGEX,
};
