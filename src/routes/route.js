const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const postController = require("../controllers/post.controller");

router.post("/register", userController.create);
router.post("/login", authController.login);
router.post("/posts", authController.verifyToken, postController.create);
router.put("/posts", authController.verifyToken, postController.updatePost);
router.delete("/posts", authController.verifyToken, postController.deletePost);

module.exports = { router };
