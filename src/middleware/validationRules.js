/**
 * Contains middleware functions that perform validation
 * controls on incoming HTTP requests.
 */

const { check } = require("express-validator");
const validationErrorMessages = require("../resources/validationErrorMessages");
const { PASSWORD_REGEX, ID_REGEX } = require("../resources/validationRegExp");

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

const postCreationRules = () => {
  return [
    check("title")
      .notEmpty()
      .withMessage(validationErrorMessages.TITLE_REQUIRED),
    check("body").notEmpty().withMessage(validationErrorMessages.BODY_REQUIRED),
    check("username")
      .notEmpty()
      .withMessage(validationErrorMessages.USERNAME_REQUIRED),
  ];
};

const postUpdateRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(validationErrorMessages.ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(validationErrorMessages.ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMessages.ID_LENGTH),
    check("title").optional(),
    check("body").optional(),
    check("username")
      .notEmpty()
      .withMessage(validationErrorMessages.USERNAME_REQUIRED),
  ];
};

const postDeletionRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(validationErrorMessages.ID_REQUIRED)
      .matches(ID_REGEX)
      .withMessage(validationErrorMessages.ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMessages.ID_LENGTH),
  ];
};

module.exports = {
  userRegistrationRules,
  postCreationRules,
  postUpdateRules,
  postDeletionRules,
};
