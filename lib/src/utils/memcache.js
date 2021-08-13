"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memcache = void 0;
const process_1 = require("process");
const redis_1 = require("redis");
const util_1 = require("util");
class Memcache {
    constructor(db = '') {
        this._client = new redis_1.RedisClient({
            db,
            host: process_1.env.REDIS_HOST,
            port: process_1.env.REDIS_PORT ? parseInt(process_1.env.REDIS_PORT) : undefined,
        });
        this._get = util_1.promisify(this._client.get).bind(this._client);
        this._set = util_1.promisify(this._client.set).bind(this._client);
        this._keys = util_1.promisify(this._client.keys).bind(this._client);
        this._mget = util_1.promisify(this._client.mget).bind(this._client);
    }
    static getInstance(db = '') {
        let inst = this._instanceForDb[db];
        if (!inst) {
            this._instanceForDb[db] = inst = new Memcache(db);
        }
        return inst;
    }
    tryGetAsync(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._get(key);
        });
    }
    tryGetObjectAsync(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.tryGetAsync(key);
            if (json) {
                return JSON.parse(json);
            }
            return null;
        });
    }
    tryGetMultipleAsync(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._mget(keys);
        });
    }
    tryGetMultipleObjectsAsync(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsons = yield this.tryGetMultipleAsync(keys);
            return jsons.map(j => j ? JSON.parse(j) : null);
        });
    }
    setAsync(key, value, expiryMs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (expiryMs) {
                yield this._set(key, value, 'PX', expiryMs);
            }
            else {
                yield this._set(key, value);
            }
        });
    }
    setObjectAsync(key, value, expiryMs) {
        return this.setAsync(key, JSON.stringify(value), expiryMs);
    }
    setMultipleAsync(items, expiryMs) {
        return __awaiter(this, void 0, void 0, function* () {
            let m = this._client.multi();
            m = m.mset(...Object.entries(items).flat(1));
            if (expiryMs) {
                for (const k of Object.keys(items)) {
                    m = m.pexpire(k, expiryMs);
                }
            }
            yield util_1.promisify(m.exec)();
        });
    }
    setMultipleObjectsAsync(items, expiryMs) {
        return this.setMultipleAsync(Object.assign({}, ...Object.entries(items).map(([k, v]) => ({ [k]: JSON.stringify(v) }))), expiryMs);
    }
    getAllKeysAsync(pattern) {
        return this._keys(pattern || '*');
    }
}
exports.Memcache = Memcache;
Memcache._instanceForDb = {};
//# sourceMappingURL=memcache.js.map