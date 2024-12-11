/**
 * The texts were retrieved from:
 * @link https://simple.wikipedia.org/wiki/JavaScript
 */

const normalSizedText = `JavaScript is a high-level programming language that follows the ECMAScript standard. It was originally designed as a scripting language for websites but became widely adopted as a general-purpose programming language, and is currently the most popular programming language in use. JavaScript is usually found running in a web browser as interactive or automated content, ranging from popup messages and live clocks to large web applications. JavaScript is also commonly used in server-side programming through platforms like Node.js, or 'embedded' in non-JavaScript applications where the base programming language lacks the high-level functionality that JavaScript offers.

Despite the similarities in name and syntax, JavaScript is not related to the programming language Java. Though the names of both languages are trademarks of Oracle Corporation, the two languages follow different design principles, and are actively developed by unrelated organizations.`;

const longText = `Frameworks

A majority of websites use what is known as a framework. Frameworks may allow programming to be easier as more predefined procedures are defined within it. Such a library is jQuery.

Video Games

JavaScript can be used to create and run video games in the browser. The modern web has quickly become a viable platform for creating and distributing high-quality games. With modern web technologies and a recent browser, it’s entirely possible to make stunning, top-notch games for the web. JavaScript is blazing fast in modern browsers and getting faster all the time. You can use its power to write the code for your game or look at using technologies like Emscripten or Asm.js to easily port your existing games.

There are also many widely adopted game engines that you can use to develop games with JavaScript and HTML5. Some popular ones include Three.js, Pixi.js, Phaser, Babylon.js, Matter.js, and PlayCanvas. These game engines provide a range of features and tools to help you create sophisticated 2D and 3D graphics without relying on third-party plugins.
Beyond web browsers

JavaScript is also used outside of web browsers. As a scripting language, JavaScript can be used to define the behaviour of applications such as extensions in GNOME Shell.

In addition, there are runtime environments for running JavaScript as a server side programming language. Such an environment is Node.js.

Electron is a framework which allows graphical applications to be made with web technologies, by running on the Chromium browser and Node.js.
Syntax

A JavaScript program is made of a collection of instructions called "statements". A semicolon marks the end of a statement, and allows multiple statements to be placed on the same line. However, it is typical to write each statement on its own line to keep a program file readable.

Variables can be defined in several ways. In an older version named "ES5", variables are defined using the var keyword. In the newer versions after ES5, variables can be defined using const for constant variables and let for local variables. The value of constant variables cannot be re-declared or reassigned. Variables assigned using const or let are contained within blocks, while variables assigned using var are contained within functions.`;

module.exports = { longText, normalSizedText };
