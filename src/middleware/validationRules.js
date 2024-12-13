/**
 * Contains middleware functions that perform validation
 * controls on incoming HTTP requests.
 */

const { check } = require("express-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const { PASSWORD_REGEX } = require("../resources/validationRegExp");

const userRegistrationRules = () => {
  return [
    check("username")
      .notEmpty()
      .withMessage(validationErrorMessages.USERNAME_REQUIRED),
    check("email")
      .notEmpty()
      .withMessage(validationErrorMessages.EMAIL_REQUIRED),
    check("password")
      .notEmpty()
      .withMessage(validationErrorMessages.PASSWORD_REQUIRED)
      .matches(PASSWORD_REGEX)
      .withMessage(validationErrorMessages.PASSWORD_IS_WEAK),
  ];
};

module.exports = {
  userRegistrationRules,
};
