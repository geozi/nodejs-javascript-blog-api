/**
 * Performing integration tests on the
 * blog post controller.
 *
 * To generated random ObjectIDs, the following was used:
 * @link https://observablehq.com/@hugodf/mongodb-objectid-generator
 */

const mongoose = require("mongoose");
const Post = require("../../src/models/post.model");
const {
  create,
  updatePost,
  deletePost,
} = require("../../src/controllers/post.controller");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");
const { longText } = require("../../src/resources/testingTexts");
const responseMessages = require("../../src/resources/responseMessages");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
});

afterAll(async () => {
  await Post.deleteMany();
  await mongoose.connection.close();
});

describe("BlogPost integration tests:", () => {
  describe("create method", () => {
    const res = {
      status: jasmine.createSpy("status").and.callFake(function () {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };

    const next = jasmine.createSpy("next");

    it("returns 201", async () => {
      const req = {
        body: {
          title: "This is my first blogPost",
          body: `A good first blogPost must contain interesting material to engage the users. This is highly important, especially for new blog writers. However, too long of a blogPost can also create fatigue among the readers. Therefore, a middle ground is needed.`,
          username: "firstUser",
        },
      };

      for (let middleware of create) {
        await middleware(req, res, next);
      }

      const post = await Post.findOne({ title: req.body.title });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.POST_CREATED,
      });
      expect(post).not.toBeNull();
      expect(post.title).toBe("This is my first blogPost");
    });

    const titleRequiredCases = [
      [
        "returns bad request -> title undefined",
        {
          body: `A good first blogPost must contain interesting material to engage the users. This is highly important, especially for new blog writers. However, too long of a blogPost can also create fatigue among the readers. Therefore, a middle ground is needed.`,
          username: "firstUser",
        },
      ],
      [
        "returns bad request ->title null",
        {
          title: null,
          body: `A good first blogPost must contain interesting material to engage the users. This is highly important, especially for new blog writers. However, too long of a blogPost can also create fatigue among the readers. Therefore, a middle ground is needed.`,
          username: "firstUser",
        },
      ],
    ];

    titleRequiredCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };

        for (middleware of create) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.TITLE_REQUIRED }],
        });
      });
    });

    const bodyRequiredCases = [
      [
        "returns bad request -> body undefined",
        {
          title: "This is my first blogPost",
          username: "firstUser",
        },
      ],
      [
        "returns bad request -> body null",
        {
          title: "This is my first blogPost",
          body: null,
          username: "firstUser",
        },
      ],
    ];

    bodyRequiredCases.forEach(([testName, input]) => [
      it(testName, async () => {
        const req = { body: input };

        for (middleware of create) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.BODY_REQUIRED }],
        });
      }),
    ]);

    const usernameRequiredCases = [
      [
        "returns bad request -> username undefined",
        {
          title: "This is my first blogPost",
          body: `A good first blogPost must contain interesting material to engage the users. This is highly important, especially for new blog writers. However, too long of a blogPost can also create fatigue among the readers. Therefore, a middle ground is needed.`,
        },
      ],
      [
        "returns bad request -> username null",
        {
          title: "This is my first blogPost",
          body: `A good first blogPost must contain interesting material to engage the users. This is highly important, especially for new blog writers. However, too long of a blogPost can also create fatigue among the readers. Therefore, a middle ground is needed.`,
          username: null,
        },
      ],
    ];

    usernameRequiredCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };

        for (middleware of create) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.USERNAME_REQUIRED }],
        });
      });
    });

    it("returns bad request -> title too long", async () => {
      const req = {
        body: {
          title: `This title is a very long title, especially designed to be used in integration testing. The aim is to check whether the mongoose validator will actually work as expected`,
          body: `A good first blogPost must contain interesting material to engage the users. This is highly important, especially for new blog writers. However, too long of a blogPost can also create fatigue among the readers. Therefore, a middle ground is needed.`,
          username: "firstUser",
        },
      };

      for (middleware of create) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMessages.TITLE_MAX_LENGTH }],
      });
    });

    it("returns bad request -> title too short", async () => {
      const req = {
        body: {
          title: "a",
          body: `A good first blogPost must contain interesting material to engage the users. This is highly important, especially for new blog writers. However, too long of a blogPost can also create fatigue among the readers. Therefore, a middle ground is needed.`,
          username: "firstUser",
        },
      };

      for (middleware of create) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMessages.TITLE_MIN_LENGTH }],
      });
    });

    it("returns bad request -> body too long", async () => {
      const req = {
        body: {
          title: "A blog post on Javascript",
          body: longText,
          username: "firstUser",
        },
      };

      for (middleware of create) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMessages.BODY_MAX_LENGTH }],
      });
    });

    it("returns bad request -> body too short", async () => {
      const req = {
        body: {
          title: "My first blog post",
          body: "ab",
          username: "firstUser",
        },
      };

      for (middleware of create) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMessages.BODY_MIN_LENGTH }],
      });
    });
  });

  describe("update method", () => {
    const res = {
      status: jasmine.createSpy("status").and.callFake(function () {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };

    const next = jasmine.createSpy("next");

    it("returns 201", async () => {
      const createReq = {
        body: {
          title: "Initial blog post",
          body: "This is my initial blog post before being updated",
          username: "firstUser",
        },
      };

      for (let middleware of create) {
        await middleware(createReq, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.POST_CREATED,
      });

      const initialPost = await Post.findOne({
        title: createReq.body.title,
      }).exec();

      const updateReq = {
        body: {
          id: initialPost._id,
          title: "An updated version",
          body: "This is an updated version of the initial blog post",
          username: "firstUser",
        },
      };

      for (let middleware of updatePost) {
        await middleware(updateReq, res, next);
      }

      const updatedPost = await Post.findById({
        _id: updateReq.body.id,
      }).exec();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.POST_UPDATED,
      });
      expect(updatedPost.title).toBe("An updated version");
    });

    const idInvalidCases = [
      [
        "returns bad request -> ID undefined",
        {
          title: "The blogPost to be updated",
          body: `This blogPost is to be updated, however it will not pass from the express validation. Its ID is undefined.`,
          username: "proUser",
        },
      ],
      [
        "returns bad request -> ID null",
        {
          id: null,
          title: "The blogPost is to be updated",
          body: `This blogPost is to be updated, however it will not pass from
            the express validation. Its ID is null.`,
          username: "proUser",
        },
      ],
    ];

    idInvalidCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };

        for (let middleware of updatePost) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { msg: validationErrorMessages.ID_REQUIRED },
            { msg: validationErrorMessages.ID_INVALID },
            { msg: validationErrorMessages.ID_LENGTH },
          ],
        });
      });
    });

    it("returns bad request -> ID invalid", async () => {
      const req = {
        body: {
          id: "67*db12ed*29a1*ed143e37e",
          username: "proUser",
        },
      };

      for (let middleware of updatePost) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMessages.ID_INVALID }],
      });
    });

    const idInvalidLengthCases = [
      [
        "returns bad request -> ID too short",
        {
          id: "675db12edc29a15ed",
          username: "proUser",
        },
      ],
      [
        "returns bad request -> ID too long",
        {
          id: "675db12edc29a15ed143e37e675db12edc29a15ed143e37e",
          username: "proUser",
        },
      ],
    ];

    idInvalidLengthCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };
        for (let middleware of updatePost) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.ID_LENGTH }],
        });
      });
    });
  });

  describe("delete method", () => {
    const res = {
      status: jasmine.createSpy("status").and.callFake(function () {
        return res;
      }),
      json: jasmine.createSpy("json"),
    };

    const next = jasmine.createSpy("next");

    it("returns 204", async () => {
      const createReq = {
        body: {
          title: "My very first blog post",
          body: `I generally do not like to post things online. However, I decided to do to improve my English writing skills. By writing often on an online platform and in public will allow me to take into consideration my audience and, thus, adjust my written style accordingly.`,
          username: "newWriter",
        },
      };

      for (let middleware of create) {
        await middleware(createReq, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.POST_CREATED,
      });

      const postToBeDeleted = await Post.findOne({
        title: createReq.body.title,
      });

      const deleteReq = {
        body: { id: postToBeDeleted._id },
      };

      for (let middleware of deletePost) {
        await middleware(deleteReq, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(204);
    });

    const idInvalidCases = [
      ["returns bad request -> ID undefined", {}],
      ["returns bad request -> ID null", { id: null }],
    ];

    idInvalidCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };

        for (let middleware of deletePost) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { msg: validationErrorMessages.ID_REQUIRED },
            { msg: validationErrorMessages.ID_INVALID },
            { msg: validationErrorMessages.ID_LENGTH },
          ],
        });
      });
    });

    it("returns bad request -> ID invalid", async () => {
      const req = {
        body: {
          id: "67*db12ed*29a1*ed143e37e",
        },
      };

      for (let middleware of deletePost) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMessages.ID_INVALID }],
      });
    });

    const idInvalidLengthCases = [
      ["returns bad request -> ID too short", { id: "675db12edc29a15ed" }],
      [
        "returns bad request -> ID too long",
        { id: "675db12edc29a15ed143e37e675db12edc29a15ed143e37e" },
      ],
    ];

    idInvalidLengthCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };

        for (let middleware of deletePost) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.ID_LENGTH }],
        });
      });
    });
  });
});
