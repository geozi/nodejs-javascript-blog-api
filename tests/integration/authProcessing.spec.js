/**
 * Performing integration tests on the auth controller.
 */
const mongoose = require("mongoose");
const { login } = require("../../src/controllers/auth.controller");
const { create } = require("../../src/controllers/user.controller");
const User = require("../../src/models/user.model");
const httpMocks = require("node-mocks-http");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");
const authMessages = require("../../src/resources/authMessages");
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

  const res = {
    status: jasmine.createSpy("status").and.callFake(function () {
      return res;
    }),
    json: jasmine.createSpy("json"),
  };

  const next = jasmine.createSpy("next");

  const createReq = {
    body: {
      username: "newUser",
      email: "email@random.com",
      password: "Dg2&ysPrc3Lol4o",
    },
  };

  for (let middleware of create) {
    await middleware(createReq, res, next);
  }
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("Auth processing integration tests:", () => {
  describe("login method", () => {
    const next = jasmine.createSpy("next");
    it("returns 200", async () => {
      const req = {
        body: {
          username: "newUser",
          password: "Dg2&ysPrc3Lol4o",
        },
      };

      const res = httpMocks.createResponse();

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data.token).toBeDefined();
    });

    const usernameRequiredCases = [
      [
        "returns bad request -> username undefined",
        {
          password: "Dg2&ysPrc3Lol4o",
        },
      ],
      [
        "returns bad request -> username null",
        {
          username: null,
          password: "Dg2&ysPrc3Lol4o",
        },
      ],
    ];

    usernameRequiredCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };
        const res = httpMocks.createResponse();

        for (let middleware of login) {
          await middleware(req, res, next);
        }

        const data = res._getJSONData();

        expect(res.statusCode).toBe(400);
        expect(data).toEqual({
          errors: [{ msg: validationErrorMessages.USERNAME_REQUIRED }],
        });
      });
    });

    it("returns unauthorized -> username does not match", async () => {
      const req = {
        body: {
          username: "ab",
          password: "Dg2&ysPrc3Lol4o",
        },
      };
      const res = httpMocks.createResponse();

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      const data = res._getJSONData();

      expect(res.statusCode).toBe(401);
      expect(data).toEqual({ message: authMessages.AUTH_FAILED });
    });

    const passwordRequiredCases = [
      [
        "returns bad request -> password undefined",
        {
          username: "newUser",
        },
      ],
      [
        "returns bad request -> password null",
        {
          username: "newUser",
          password: null,
        },
      ],
    ];

    passwordRequiredCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };
        const res = httpMocks.createResponse();

        for (let middleware of login) {
          await middleware(req, res, next);
        }

        const data = res._getJSONData();

        expect(res.statusCode).toBe(400);
        expect(data).toEqual({
          errors: [
            { msg: validationErrorMessages.PASSWORD_REQUIRED },
            { msg: validationErrorMessages.PASSWORD_IS_WEAK },
          ],
        });
      });
    });

    const passwordInvalidCases = [
      [
        "returns bad request -> password with no lowercase characters",
        {
          username: "newUser",
          password: "0C+W#8S[AB@HR-,",
        },
      ],
      [
        "returns bad request -> password with no uppercase characters",
        {
          username: "newUser",
          password: "&itb8_m}p$=xnx5",
        },
      ],
      [
        "returns bad request -> password with no numbers",
        {
          username: "newUser",
          password: "FIDeZbt)WR-r(S&",
        },
      ],
      [
        "returns bad request -> password with not special characters",
        {
          username: "newUser",
          password: "8XXV4FrMdqt6r2g",
        },
      ],
    ];

    passwordInvalidCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };
        const res = httpMocks.createResponse();

        for (let middleware of login) {
          await middleware(req, res, next);
        }

        const data = res._getJSONData();

        expect(res.statusCode).toBe(400);
        expect(data).toEqual({
          errors: [{ msg: validationErrorMessages.PASSWORD_IS_WEAK }],
        });
      });
    });
  });
});
