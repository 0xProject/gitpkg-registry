"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheControl = void 0;
/**
 *  Sets the Cache related headers in a response
 */
function cacheControl(DEFAULT_CACHE_AGE_SECONDS) {
    return (req, res, next) => {
        if (req.method === 'GET') {
            res.set('Cache-control', `public, max-age=${DEFAULT_CACHE_AGE_SECONDS}, s-maxage=${DEFAULT_CACHE_AGE_SECONDS}`);
        }
        next();
    };
}
exports.cacheControl = cacheControl;
//# sourceMappingURL=cache_control.js.map