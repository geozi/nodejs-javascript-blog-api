const Post = require("../models/post.model");
const {
  postCreationRules,
  postUpdateRules,
  postDeletionRules,
} = require("../middleware/validationRules");
const responseMessages = require("../resources/responseMessages");
const validator = require("express-validator");

/**
 * Handles new blogpost persistence.
 *
 * When the create method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of post creation requests. If the validation passes, it
 * proceeds to the main logic of the method which handles new post persistence.
 */
const create = [
  ...postCreationRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        msg: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { title, body, username } = req.body;
      const newPost = new Post({
        title: title,
        body: body,
        username: username,
      });

      await newPost.save();
      return res.status(201).json({ message: responseMessages.POST_CREATED });
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

/**
 * Handles blogpost update.
 *
 * When the updatePost method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of post update requests. If the validation passes, it
 * proceeds to the main logic of the method which handles blogpost updates.
 */
const updatePost = [
  ...postUpdateRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        msg: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { id, title, body, username } = req.body;
      const postToUpdate = {
        title: title,
        body: body,
        username: username,
      };

      const updatedPost = await Post.findByIdAndUpdate(id, postToUpdate, {
        new: true,
        runValidators: true,
        context: "query",
      });

      if (!updatedPost) {
        return res
          .status(404)
          .json({ message: responseMessages.POST_NOT_FOUND });
      }

      return res.status(201).json({ message: responseMessages.POST_UPDATED });
    } catch (err) {
      if (err.name == "ValidationError") {
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

/**
 * Handles blogpost removal.
 *
 * When the deletePost method is called, it first
 * executes the ValidationChain path, running all middleware
 * functions responsible for the validation of blogpost removal
 * requests. If the validation passes, it proceeds to the main logic
 * of the method which handles blogpost removals.
 */
const deletePost = [
  ...postDeletionRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        msg: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { id } = req.body;
      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        return res
          .status(404)
          .json({ message: responseMessages.POST_NOT_FOUND });
      }
      return res.status(204).json({ message: responseMessages.POST_DELETED });
    } catch (err) {
      if (err.name == "ValidationError") {
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

module.exports = { create, updatePost, deletePost };
