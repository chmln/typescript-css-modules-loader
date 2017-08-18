"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const css = require("css");
const stylus = require("stylus");
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
const parseStylus = (sourceCode) => new Promise((resolve, reject) => {
    stylus.render(sourceCode, {}, (err, css) => err ? reject(err) : resolve(css));
});
async function getStylusAST(path) {
    try {
        const content = (await readFile(path)).toString();
        const cssCode = await parseStylus(content);
        const result = css.parse(cssCode);
        return result.stylesheet !== undefined
            ? result.stylesheet.rules
            : null;
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
async function parse(path) {
    const rules = await getStylusAST(path);
    if (rules === null)
        return null;
    const options = {};
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.selectors !== undefined)
            rule.selectors
                .forEach(selector => {
                const classes = selector.split(".").slice(1);
                const rootIndex = selector.indexOf(" ") === -1 ? 0 : selector.split(" ").length - 1;
                const root = classes[rootIndex];
                const modifiers = classes.slice(rootIndex + 1);
                if (options[root] === undefined)
                    options[root] = modifiers || [];
                else if (modifiers.length > 0)
                    modifiers.forEach(m => options[root].indexOf(m) === -1 && options[root].push(m));
            });
    }
    const declaration = Object.keys(options).reduce((d, selector) => {
        const modifiers = options[selector].map(s => `${s}?: boolean`).join(",\n");
        const opts = `{ ${modifiers} }`;
        return d.concat(`export const ${selector}: (o?: ${opts}) => string;\n`);
    }, "");
    return declaration;
}
const start = async (path) => await parse(path);
exports.default = start;
