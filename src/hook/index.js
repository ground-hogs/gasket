const { tmpdir } = require("os");
const { posix } = require('path');
const { writeFileSync, readFileSync, existsSync } = require("fs");
const hashFile = require("./register/hashFile");
const desugar = require("./register/desugar");

const { join, dirname } = posix;

const REGISTER_DEFAULTS = {
    extension: ".jsx",
    generatedExtension: ".jsx.js",
    cacheDir: tmpdir(),
    h: "Castella.Render",
    development: false
};

let OPTIONS;

function register(options = {}) {
    OPTIONS = {
        ...REGISTER_DEFAULTS,
        ...options
    };

    const { extension, generatedExtension, cacheDir, development } = OPTIONS;

    OPTIONS.__oldExtensionHandler = require.extensions[extension];

    require.extensions[extension] = function JSXExtensionHandler(module, file) {

        if(!file.endsWith(extension)){
            throw new Error("This is not a JSX file we can work with");
        }

        module.paths.push(dirname(file));
        const original = readFileSync(file).toString();
        const converted = {};
        converted.filename = hashFile(file, original) + generatedExtension;
        converted.path = join(cacheDir, converted.filename);
        
        if(existsSync(converted.path) && !development){
            return compile(module, converted.path);
        }
        
        converted.code = desugar(original, {
            stringifier: OPTIONS.h
        });

        writeFileSync(converted.path, converted.code);

        if ('__oldExtensionHandler' in OPTIONS && OPTIONS.__oldExtensionHandler instanceof Function) {
            OPTIONS.__oldExtensionHandler(module, converted.path);
        }
        else {
            require.extensions[".js"](module, converted.path);
        }
    };
}

function unregister(){
    if(!('extension' in OPTIONS) || !('__oldExtensionHandler' in OPTIONS)){
        return;
    }

    const { extension, __oldExtensionHandler } = OPTIONS;
    require.extensions[extension] = __oldExtensionHandler;
}

function compile(module, path){
    if ('__oldExtensionHandler' in OPTIONS && OPTIONS.__oldExtensionHandler instanceof Function) {
        OPTIONS.__oldExtensionHandler(module, path);
    }
    else {
        require.extensions[".js"](module, path);
    }
}

module.exports ={
    register,
    unregister
};