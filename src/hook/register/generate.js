const astring = require("astring");


module.exports = function generate(ast, {stringifier}) {
    
    var extraParsing = {
        JSXElement (node, state) {
            state.output += stringifier + "(";
            this.JSXOpeningElement(node.openingElement, state);
            state.output += ', [';
            node.children.forEach(child => {
                this[child.type](child, state); 
                state.output += ',';
            });
            state.output += '])'
        },
        JSXOpeningElement (node, state) {
            this.JSXIdentifier(node.name, state);
            state.output += ', {';
            node.attributes.forEach(attr => {
                this.JSXAttribute(attr, state);
                state.output += ',';
            });
            state.output += '}';
        },
        JSXClosingElement () {
            state.output += ')';
        },
        JSXIdentifier (node, state) {
            if (node.name[0].toLowerCase() === node.name[0]) {
                state.output += `"${node.name}"`;
            }
            else {
                state.output += node.name;
            }
        },
        JSXMemberExpression (node, state) {
            this.MemberExpression(node, state);
        },
        JSXAttribute (node, state) {
            this.JSXIdentifier(node.name, state);
            state.output += ':';
            if(node.value === null) {
                node.value = {
                    type: 'JSXExpressionContainer',
                    expression: {
                      type: 'Literal',
                      value: true,
                      raw: 'true'
                    }
                  }
            }
            this.JSXExpressionContainer(node.value, state);
        },/*
        , // leaving this commented up to the point where we're ready to implement this. 
        JSXNamespacedName () {
            throw new Error("Unimplemented feature: JSX Namespaced Names are not implemented yet");
        }
        */
        JSXExpressionContainer (node, state) {
            if(node.type === "Literal"){
                this.Literal(node,state);
            }
            else if(node.expression && this[node.expression.type]) {
                this[node.expression.type](node.expression, state);
            }
        },
        JSXText (node, state) {
            const quoted = node.value.trim().replace(/([\"\'\`])/g, "\\$1");
            node.raw = node.value = `"${quoted}"`;
            this.Literal(node, state);
        }
    };
    
    var customGenerator = {
        ...astring.baseGenerator, 
        ...extraParsing
    };
    
    const transformed = astring.generate(ast, { generator: customGenerator, comments: true });

    return transformed;
};