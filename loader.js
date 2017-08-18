"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    const loader = this;
    loader.cacheable && loader.cacheable();
    loader.addDependency(loader.resourcePath);
    console.log(loader);
}
exports.default = default_1;
;
