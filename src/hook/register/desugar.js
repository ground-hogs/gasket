const generate = require("./generate");
const { Parser } = require("acorn");

module.exports = function desugar(code, options = {}) {
    const JSXParser = Parser.extend(
        require("acorn-jsx")(),
    );
    const ast = JSXParser.parse(code);
    const transformed = generate(ast, options);

    return transformed;
};