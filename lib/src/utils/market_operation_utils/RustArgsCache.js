"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustArgsCache = void 0;
class RustArgsCache {
    constructor() {
        this.cache = [];
    }
    static getInstance() {
        if (!RustArgsCache.instance) {
            RustArgsCache.instance = new RustArgsCache();
        }
        return RustArgsCache.instance;
    }
    add(item) {
        this.cache.push(item);
        console.log("add a new item to cache", item);
    }
    len() {
        console.log("cache size", this.cache.length);
        return this.cache.length;
    }
}
exports.RustArgsCache = RustArgsCache;
;
//# sourceMappingURL=RustArgsCache.js.map