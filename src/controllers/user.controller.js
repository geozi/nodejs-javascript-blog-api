const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { userRegistrationRules } = require("../middleware/validationRules");
const responseMessages = require("../resources/responseMessages");

/**
 * Handles user registration.
 *
 * When the create method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for validation. If the validation passes, it proceeds to the main
 * logic of the method which handles user creation and response generation.
 */
const create = [
  ...userRegistrationRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array().map((err) => ({
        msg: err.msg,
      }));

      return res.status(400).json({ errors: errorMessage });
    }

    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: responseMessages.USER_REGISTERED });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          msg: e.message,
        }));

        return res.status(400).json({ errors: mongooseErrors });
      }
      return res
        .status(500)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

module.exports = { create };
