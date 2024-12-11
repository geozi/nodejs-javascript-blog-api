/**
 * Performing unit tests on the Post model
 *
 * Post body text was retrieved from:
 * @link https://simple.wikipedia.org/wiki/JavaScript
 */

const Post = require("../../src/models/post.model");
const {
  normalSizedText,
  longText,
} = require("../../src/resources/testingTexts");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("Post model tests:", () => {
  describe("valid title", () => {
    it("should pass validation", () => {
      const post = new Post({
        title: "This is a title of a blog,which is not very long.",
      });
      const err = post.validateSync();
      expect(err).toBeUndefined();
    });
  });

  describe("invalid title", () => {
    it("should not pass validation -> too long", () => {
      const post = new Post({
        title:
          "This is a title of a blog, which is quite long in order to be used in a unit test in a negative scenario involving an invalid title field.",
      });
      const err = post.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.title).toBeDefined();
      expect(err.errors.title.message).toBe(
        validationErrorMessages.TITLE_MAX_LENGTH
      );
    });

    it("should not pass validation -> too short", () => {
      const post = new Post({
        title: "ab",
      });
      const err = post.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.title).toBeDefined();
      expect(err.errors.title.message).toBe(
        validationErrorMessages.TITLE_MIN_LENGTH
      );
    });
  });

  describe("valid post body", () => {
    it("should pass validation", () => {
      const post = new Post({
        body: normalSizedText,
      });
      const err = post.validateSync();
      expect(err).toBeUndefined();
    });
  });

  describe("invalid post body", () => {
    it("should not pass validation -> too short", () => {
      const post = new Post({
        body: "hi",
      });

      const err = post.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.body).toBeDefined();
      expect(err.errors.body.message).toBe(
        validationErrorMessages.BODY_MIN_LENGTH
      );
    });

    it("should not pass validation -> too long", () => {
      const post = new Post({
        body: longText,
      });
      const err = post.validateSync();

      expect(err).toBeDefined();
      expect(err.errors.body).toBeDefined();
      expect(err.errors.body.message).toBe(
        validationErrorMessages.BODY_MAX_LENGTH
      );
    });
  });
});
