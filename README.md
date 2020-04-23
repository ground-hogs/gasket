# Gasket

## Introduction

Gasket is a require hook enabling you to require `.jsx` files without bringing Babel around. That way, instead of bringing along 60 dependencies, there's only 3. 

Of course, this comes at a cost: Babel does a million different things for you, only one of which is traducing JSX. Gasket doesn't.  

We also kinda just launched and are thus not especially stable yet. 

But hey, we'll get better. 

There's a caveat: `Gasket` only translates the JSX into viable JS, since this is the 1st part of what makes JSX in React so pleasant. 
The 2nd one, though, is just as important for usability purposes, which is actually providing an usable "h" function translating this calls into proper HTML. 

That is handled by another project of ours, called `Castella`. 

## Usage

Gasket requires very little in the way of preparation to enable its usage. 

Suppose you have a `Page.jsx` file like so:

```jsx
// Castella is our "stringifier". Works a lot like React.createElement minus the React part. 
const Castella = require("castella");

module.exports = function Page({children, ...props} = {}){
    return <div className={'page ' + props.className}>{children}</div>
}
```

Then, in order to use and render it you would do something like this:

```js
const {requireHook} = require("./src");

requireHook.register({
    // I've listed EVERY configuration option. You can skip any 
    
    development: true,// in development=true mode the translation 
                      // will be done every single time require() runs
                      // in development=false mode the translation will
                      // be done only if the source file has a different content
    
    h: "Castella.Render", // "h" is our createElement. 
                          // It should be require()d by each JSX file.
                          // Use something else if you have it. 
                          // Castella is pretty cool.  

    extension: ".jsx",    // the extension of your JSX files. 
                          // Could be .template, too?

    generatedExtension: ".jsx.js", // The traslated files extension

    cacheDir: require("os").tmpdir(), // The cached files live here.
                                      // Ensure you have write access
                                      // to whatever directory you 
                                      // choose
});
// From this point onwards you can require any JSX file you want
const page = require("./test/assets/Page");

var   dom  = page({ className: "test", children: ["test"]});
console.log(dom.toString());
// result should look like: 
// <div class="page test">test</div>
```

An `unregister` function is also provided, 

## Support us

Since we have literally no idea wether this will work on older nodejs versions, at the very least you are required to have `13.12.0`.

We also are missing support for namespaced JSX entities, mostly because we haven't ever seen someone actually using them. 

Oh, and tests! It would be fairly cool to have tests in place. You know, so we can be sure this is usable with any degree of certainty. 
