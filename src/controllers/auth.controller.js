const validator = require("express-validator");
const authMessages = require("../../src/resources/authMessages");
const bcrypt = require("bcryptjs");
const User = require("../../src/models/user.model");
const responseMessages = require("../../src/resources/responseMessages");
const jwt = require("jsonwebtoken");
const {
  userLoginRules,
  headerValidationRules,
} = require("../middleware/validationRules");

/**
 * Handles login requests.
 *
 * When the login method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of login requests. If the validation passes, it
 * proceeds to the main logic of the method which handles user login.
 */
const login = [
  ...userLoginRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        msg: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(401).json({ message: authMessages.AUTH_FAILED });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: authMessages.AUTH_FAILED });
      }

      const token = jwt.sign({ username: user.username }, process.env.KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({ token: token });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          msg: e.message,
        }));
        return res.status(400).json({ errors: mongooseErrors });
      }

      return res
        .status(400)
        .json({ message: responseMessages.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Handles jwt verification.
 *
 * When the verifyToken method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of web tokens. If the validation passes, it continues with
 * token verification. If the verification is successful, it then proceeds to
 * the logic coming next in the declared path.
 */
const verifyToken = [
  ...headerValidationRules(),
  async (req, res, next) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        msg: err.msg,
      }));

      return res.status(401).json({ errors: errorMsg });
    }

    try {
      const token = req.header("Authorization");
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.KEY);
      req.body.username = decoded.username;
      next();
    } catch (err) {
      res.status(401).json({ message: authMessages.TOKEN_INVALID });
    }
  },
];

module.exports = { login, verifyToken };
