const { requireHook } = require("../src");

requireHook.register({
    development: true
});

console.log(require("os").tmpdir());

const page = require("./assets/Page");
console.log({
    page: page(),
    children: page().vdom.children,
    str: page().toString()
});