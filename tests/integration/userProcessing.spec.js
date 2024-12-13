const mongoose = require("mongoose");
const User = require("../../src/models/user.model");
const { create } = require("../../src/controllers/user.controller");
const responseMessages = require("../../src/resources/responseMessages");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("User processing integration tests: ", () => {
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
          username: "newUser",
          email: "email@random.com",
          password: "Dg2&ysPrc3Lol4o",
        },
      };

      for (let middleware of create) {
        await middleware(req, res, next);
      }

      const user = await User.findOne({ username: req.body.username });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(user).not.toBeNull();
      expect(user.username).toBe("newUser");
    });

    const usernameRequiredCases = [
      [
        "returns bad request -> undefined username",
        {
          email: "random@mail.com",
          password: "AB,_La(2M-IoxAX",
        },
      ],
      [
        "returns bad request -> null username",
        {
          username: null,
          email: "aMail@example.com",
          password: "p-c(UC-P9v-Hp0~",
        },
      ],
    ];

    usernameRequiredCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.USERNAME_REQUIRED }],
        });
      });
    });

    it("returns bad request -> username too short", async () => {
      const req = {
        body: {
          username: "ab",
          email: "random@mail.com",
          password: "bwZ_Pc)^.5h7@%8",
        },
      };

      for (let middleware of create) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMessages.USERNAME_MIN_LENGTH }],
      });
    });

    it("returns bad request -> username too long", async () => {
      const req = {
        body: {
          username: "thisIsAVeryLongUsername",
          email: "myemail@example.com",
          password: "@i66zQ=h)2FLKBh",
        },
      };

      for (let middleware of create) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMessages.USERNAME_MAX_LENGTH }],
      });
    });

    const emailRequiredCases = [
      [
        "returns bad request -> email undefined",
        {
          username: "newUser",
          password: ")Xiz^fr!h3S[1oR",
        },
      ],
      [
        "returns bad request -> email null",
        {
          username: "u123",
          email: null,
          password: "dsv%UT(w&GYL9%o",
        },
      ],
    ];

    emailRequiredCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.EMAIL_REQUIRED }],
        });
      });
    });

    const emailInvalidCases = [
      [
        "returns bad request -> email with no prefix",
        {
          username: "u15",
          email: "@mail.com",
          password: "L6!t6zIp9m'oZiS",
        },
      ],
      [
        "returns bad request -> email with no @",
        {
          username: "newUser",
          email: "randommail.com",
          password: "ck12ltBMbCCCvYwCQ*",
        },
      ],
      [
        "returns bad request -> email with no email domain",
        {
          username: "nu1",
          email: "random@.com",
          password: "edVs$$)%&3;yW[6",
        },
      ],
      [
        "returns bad request -> email with no .",
        {
          username: "user1234",
          email: "random@mailcom",
          password: "Cv})9{ZjIxmlktu",
        },
      ],
      [
        "returns bad request -> email with no top level domain",
        {
          username: "randomUser1",
          email: "random@mail.",
          password: "),4%^M]&QpHmoH,",
        },
      ],
    ];

    emailInvalidCases.forEach(([testName, input]) => [
      it(testName, async () => {
        const req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.EMAIL_INVALID }],
        });
      }),
    ]);

    const passwordRequiredCases = [
      [
        "returns bad request -> password undefined",
        {
          username: "randomUser",
          email: "myEmail@example.gr",
        },
      ],
      [
        "returns bad request -> password null",
        {
          username: "user1",
          email: "mymail@example.gr",
          password: null,
        },
      ],
    ];

    passwordRequiredCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
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
          username: "user24",
          email: "me@random.gr",
          password: "0C+W#8S[AB@HR-,",
        },
      ],
      [
        "returns bad request -> password with no uppercase characters",
        {
          username: "user24",
          email: "new@email.com",
          password: "&itb8_m}p$=xnx5",
        },
      ],
      [
        "returns bad request -> password with no numbers",
        {
          username: "newUser",
          email: "hello@email.com",
          password: "FIDeZbt)WR-r(S&",
        },
      ],
      [
        "returns bad request -> password with not special characters",
        {
          username: "u1234",
          email: "myEmail@example.com",
          password: "8XXV4FrMdqt6r2g",
        },
      ],
    ];

    passwordInvalidCases.forEach(([testName, input]) => {
      it(testName, async () => {
        const req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.PASSWORD_IS_WEAK }],
        });
      });
    });
  });
});
