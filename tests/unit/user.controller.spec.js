const bcrypt = require("bcryptjs");
const User = require("../../src/models/user.model");
const responseMessages = require("../../src/resources/responseMessages");
const { create } = require("../../src/controllers/user.controller");
const validationErrorMessages = require("../../src/resources/validationErrorMessages");

describe("User controller tests:", () => {
  describe("create function", () => {
    let req, res, next;

    beforeEach(() => {
      res = {
        status: jasmine.createSpy("status").and.callFake(function () {
          return res;
        }),
        json: jasmine.createSpy("json"),
      };
      next = jasmine.createSpy("next");

      bcrypt.hash = jasmine
        .createSpy("hash")
        .and.callFake(async (data, salt) => "hashedPassword");

      User.prototype.save = jasmine
        .createSpy("save")
        .and.returnValue(Promise.resolve({}));
    });

    xit("returns HTTP status code 201", async () => {
      req = {
        body: {
          username: "newUser",
          email: "myEmail@example.com",
          password: "lj}6L6H$=0(UgI&",
        },
      };

      for (let middleware of create) {
        await middleware(req, res, next);
      }

      expect(bcrypt.hash).toHaveBeenCalledWith("lj}6L6H$=0(UgI&", 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: responseMessages.USER_REGISTERED,
      });
    });

    const usernameRequiredCases = [
      [
        "returns bad request -> undefined username",
        { email: "random@mail.com", password: "AB,_La(2M-IoxAX" },
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
      xit(testName, async () => {
        const req = { body: input };

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(User.prototype.save).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMessages.USERNAME_REQUIRED }],
        });
      });
    });

    it("returns bad request -> username too short", async () => {
      req = {
        body: {
          username: "ThisIsAVeryBigUsernameForTestingPurposes",
          email: "random@mail.com",
          password: "bwZ_Pc)^.5h7@%8",
        },
      };

      for (let middleware of create) {
        await middleware(req, res, next);
      }

      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMessages.USERNAME_MIN_LENGTH }],
      });
    });
  });
});
