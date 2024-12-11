/**
 * Performing tests on regular expressions used by
 * the mongoose-unique-validator.
 *
 * Random passwords are generated by:
 * @link https://www.avast.com/random-password-generator#pc
 */
const {
  PASSWORD_REGEX,
  EMAIL_REGEX,
} = require("../../src/resources/validationRegExp");

describe("Password regex tests: ", () => {
  describe("valid password", () => {
    it("should match regex", () => {
      const password = "z!y){Zz~E8^]y~R";
      expect(password).toMatch(PASSWORD_REGEX);
    });
  });
  describe("invalid password", () => {
    const passwordInvalidCases = [
      ["should not match regex -> no lowercase characters", "MPZVVPTZHGUSJJY"],
      ["should not match regex -> no uppercase characters", "lb,$rj469pr11v;"],
      ["should not match regex -> no numbers", "+c&uYXi~nVbUNBq"],
      ["should not match regex -> no special characters", "eOJw0yjymc1zcUP"],
    ];

    passwordInvalidCases.forEach(([testName, input]) => {
      it(testName, () => {
        const password = input;
        expect(password).not.toMatch(PASSWORD_REGEX);
      });
    });
  });
});

describe("Email regex tests:", () => {
  describe("valid email", () => {
    it("should match regex", () => {
      const email = "mail@random.org";
      expect(email).toMatch(EMAIL_REGEX);
    });
  });

  describe("invalid email", () => {
    const emailInvalidCases = [
      ["should not match regex -> empty", ""],
      ["should not match regex -> no prefix", "@mail.com"],
      ["should not match regex -> no @", "randommailcom"],
      ["should not match regex -> no domain name", "random@.com"],
      ["should not match regex -> no .", "random@mailcom"],
      ["should not match regex -> not top level domain", "random@mail."],
    ];

    emailInvalidCases.forEach(([testName, input]) => {
      it(testName, () => {
        const email = input;
        expect(email).not.toMatch(EMAIL_REGEX);
      });
    });
  });
});
