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
exports.LiveChain = void 0;
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const crypto = require("crypto");
const artifacts_1 = require("../artifacts");
const wrappers_1 = require("../wrappers");
const constants_1 = require("./constants");
const fast_abi_1 = require("./fast_abi");
const utils_2 = require("../utils/utils");
const memcache_1 = require("../utils/memcache");
const DEFAULT_CALL_GAS_LIMIT = 4e6;
const DEFAULT_CALLER_ADDRESS = utils_1.hexUtils.random(20);
const DISPATCHER_CONTRACT_ADDRESS = utils_1.hexUtils.random(20);
const DISPATCHER_CONTRACT_BYTECODE = artifacts_1.artifacts.CallDispatcher.compilerOutput.evm.deployedBytecode.object;
const DISPATCHER_CONTRACT = new wrappers_1.CallDispatcherContract(DISPATCHER_CONTRACT_ADDRESS, constants_1.DUMMY_PROVIDER, {}, {}, DISPATCHER_CONTRACT_BYTECODE, fast_abi_1.createFastAbiEncoderOverrides(wrappers_1.CallDispatcherContract));
const DISPATCH_CALL_INFO_ENCODER = utils_1.AbiEncoder.create([
    {
        name: 'callInfo',
        type: 'tuple',
        components: [
            { name: 'to', type: 'address' },
            { name: 'gas', type: 'uint256' },
            { name: 'value', type: 'uint256' },
            { name: 'data', type: 'bytes' },
        ],
    },
]);
class LiveChain {
    constructor(opts) {
        this._openBatches = [];
        this._queuedEthCallByHash = {};
        // How many outstanding eth_calls there are.
        this._outstandingCalls = [];
        this._chainId = opts.chainId;
        this._w3 = opts.w3;
        this._maxCacheAgeMs = opts.maxCacheAgeMs;
        this._callTimeoutMs = opts.callTimeoutMs;
        this._maxBatchGas = opts.maxBatchGas;
        this._maxBatchBytes = opts.maxBatchBytes;
        this._maxOutstandingCalls = opts.maxOutstandingCalls;
        this._memcache = memcache_1.Memcache.getInstance(`livechain@1.0.0-${this.chainId}`);
    }
    get provider() {
        return this._w3.getProvider();
    }
    get chainId() {
        return this._chainId;
    }
    static createAsync(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullOpts = Object.assign({ maxCacheAgeMs: 600e3, pruneFrequencyMs: 5e3, callTimeoutMs: 5e3, 
                // These numbers will all affect how calls are batched across
                // RPC calls.
                flushFrequencyMs: 100, maxBatchGas: 900e6, maxBatchBytes: 512e3, maxOutstandingCalls: 8 }, opts);
            const w3 = new web3_wrapper_1.Web3Wrapper(opts.provider);
            const chainId = (yield w3.getChainIdAsync());
            const inst = new LiveChain(Object.assign({ chainId,
                w3 }, fullOpts));
            void inst._autoFlushAsync(fullOpts.flushFrequencyMs);
            return inst;
        });
    }
    ethCallAsync(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let c;
            const p = new Promise((accept, reject) => {
                // This executes right away so `c` will be defined in this fn.
                c = {
                    id: hashCall(opts),
                    opts,
                    accept,
                    reject,
                };
            });
            if (opts.maxCacheAgeMs) {
                // Check the cache.
                const cachedResult = yield this._findCachedCallResultAsync(c.id, opts.maxCacheAgeMs);
                if (cachedResult) {
                    resolveQueuedCall(c, cachedResult);
                    return p;
                }
                // Cache both success and failure results.
                p.then(resultData => this._cacheCallResultAsync(c.id, resultData)).catch(error => {
                    // Only cache reverts.
                    if (error.message && error.message.indexOf('reverted') !== -1) {
                        this._cacheCallResultAsync(c.id, undefined, error);
                    }
                });
            }
            if (opts.timeoutMs) {
                void (() => __awaiter(this, void 0, void 0, function* () { return setTimeout(() => c.reject(new Error('ethCall timed out')), opts.timeoutMs); }))();
            }
            // Just queue up and batch dispatch later.
            this._batchCall(c);
            return p;
        });
    }
    _batchCall(c) {
        // Check for duplicate calls already in the queue.
        {
            const existing = this._queuedEthCallByHash[c.id];
            if (existing) {
                // Found a duplicate in queue. Just chain the callbacks on the existing one.
                existing.accept = chainCalls(existing.accept, c.accept);
                existing.reject = chainCalls(existing.reject, c.reject);
                return;
            }
        }
        this._queuedEthCallByHash[c.id] = c;
        c.accept = chainCalls((..._args) => void delete this._queuedEthCallByHash[c.id], c.accept);
        c.reject = chainCalls((..._args) => void delete this._queuedEthCallByHash[c.id], c.reject);
        // Try to fit in an open batch.
        for (const b of this._openBatches) {
            if (b.tryToAdd(c)) {
                return;
            }
        }
        // Otherwise create a new batch.
        const batch = new EthCallBatch(this._maxBatchGas, this._maxBatchBytes);
        if (!batch.tryToAdd(c)) {
            throw new Error(`Failed to add call to fresh batch`);
        }
        this._openBatches.push(batch);
    }
    _findCachedCallResultAsync(callId, maxCacheAgeMs) {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = yield this._memcache.tryGetObjectAsync(callId);
            if (cached && Date.now() - cached.dispatchTime < (maxCacheAgeMs || 0)) {
                return cached;
            }
            return;
        });
    }
    _cacheCallResultAsync(callId, successResult, error) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._memcache.setObjectAsync(callId, {
                dispatchTime: Date.now(),
                success: !error,
                resultData: error || successResult,
            }, this._maxCacheAgeMs);
        });
    }
    _autoFlushAsync(frequency) {
        return __awaiter(this, void 0, void 0, function* () {
            let nextFlushTime = Date.now() + frequency;
            this._flushAsync();
            setTimeout(() => this._autoFlushAsync(frequency), Math.max(0, nextFlushTime - Date.now()));
        });
    }
    _flushAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxDispatchCount = Math.max(0, this._maxOutstandingCalls - this._outstandingCalls.length);
            const dispatchPromises = this._openBatches.splice(0, maxDispatchCount).map(b => this._dispatchBatchAsync(b));
            this._outstandingCalls.push(...dispatchPromises);
            for (const p of dispatchPromises) {
                p.finally(() => {
                    this._outstandingCalls = this._outstandingCalls.filter(_p => p !== _p);
                });
            }
            if (this._outstandingCalls.length) {
                yield Promise.race(this._outstandingCalls);
            }
        });
    }
    _dispatchBatchAsync(batch) {
        return __awaiter(this, void 0, void 0, function* () {
            if (batch.calls.length === 0) {
                return;
            }
            const rejectBatch = (err) => {
                batch.calls.forEach(c => c.reject(err));
            };
            let rawResultData;
            try {
                rawResultData = yield utils_2.timeItAsync(() => timeoutAsync(this._w3.callAsync(batch.getFinalCallOpts()), this._callTimeoutMs, () => new Error(`callAsync took too long`)), dt => {
                    return `callAsync took ${dt}ms (${batch.bytesSize / 1024}kb) (${batch.callOpts.gas / 1e6}M gas)`;
                });
            }
            catch (err) {
                // tslint:disable-next-line: no-console
                console.error(err);
                rejectBatch(err);
                return;
            }
            if (!rawResultData || rawResultData === constants_1.NULL_BYTES) {
                rejectBatch(`EVM Dispatch call failed`);
                return;
            }
            const results = DISPATCHER_CONTRACT.getABIDecodedReturnData('dispatch', rawResultData);
            if (results.length !== batch.calls.length) {
                rejectBatch(new Error(`Expected dispatcher result to be the same length as number of calls`));
                return;
            }
            // resolve each call in the batch.
            results.forEach((r, i) => resolveQueuedCall(batch.calls[i], r));
        });
    }
}
exports.LiveChain = LiveChain;
class EthCallBatch {
    constructor(_maxGas, _maxBytes) {
        this._maxGas = _maxGas;
        this._maxBytes = _maxBytes;
        this.calls = [];
        this.callOpts = {
            data: constants_1.NULL_BYTES,
            to: DISPATCHER_CONTRACT_ADDRESS,
            value: constants_1.ZERO_AMOUNT,
            overrides: {
                [DISPATCHER_CONTRACT_ADDRESS]: { code: DISPATCHER_CONTRACT_BYTECODE },
            },
            gas: 100e3,
            gasPrice: constants_1.ZERO_AMOUNT,
        };
        this._overridesByteSize = DISPATCHER_CONTRACT_BYTECODE.length;
    }
    getFinalCallOpts() {
        return Object.assign(Object.assign({}, this.callOpts), { 
            // Encode the calldata as:
            // `[selector, numCalls, ...callData]`
            data: utils_1.hexUtils.concat(DISPATCHER_CONTRACT.getSelector('dispatch'), utils_1.hexUtils.leftPad(this.calls.length), this.callOpts.data), from: DEFAULT_CALLER_ADDRESS });
    }
    tryToAdd(c) {
        const gasPrice = c.opts.gasPrice || constants_1.ZERO_AMOUNT;
        // Gas prices must not conflict.
        if (!this.callOpts.gasPrice.eq(gasPrice)) {
            return false;
        }
        // Track overrides size and make sure overides do not conflict.
        let newOverridesBytesSize = 0;
        const overrides = c.opts.overrides || {};
        for (const addr in overrides) {
            if (addr in this.callOpts.overrides) {
                if (this.callOpts.overrides[addr].code != overrides[addr].code) {
                    return false;
                }
            }
            else {
                newOverridesBytesSize += (overrides[addr].code || '').length;
            }
        }
        if (this.calls.length > 0) {
            const extraFullnessGuess = Math.max((c.opts.gas || DEFAULT_CALL_GAS_LIMIT) / this._maxGas, (newOverridesBytesSize + c.opts.data.length) / this._maxBytes);
            if (this.fullness + extraFullnessGuess > 1.0) {
                return false;
            }
        }
        const callInfo = {
            data: c.opts.data,
            to: c.opts.to,
            gas: new utils_1.BigNumber(c.opts.gas || DEFAULT_CALL_GAS_LIMIT),
            value: c.opts.value || constants_1.ZERO_AMOUNT,
        };
        const encodedCallInfo = DISPATCH_CALL_INFO_ENCODER
            .encode({ callInfo }, { shouldOptimize: false, shouldAnnotate: false });
        // Update calldata to be [...callData, encode(callInfo).length, encode(callInfo)].
        // This is a proprietary encoding scheme that only CallDispatcher understands.
        this.callOpts.data = utils_1.hexUtils.concat(this.callOpts.data, utils_1.hexUtils.leftPad(utils_1.hexUtils.size(encodedCallInfo)), encodedCallInfo);
        // Combine call value.
        if (c.opts.value) {
            this.callOpts.value = this.callOpts.value.plus(c.opts.value);
        }
        // Merge overrides.
        Object.assign(this.callOpts.overrides, c.opts.overrides);
        // Combine call gas.
        this.callOpts.gas += c.opts.gas || DEFAULT_CALL_GAS_LIMIT;
        // Update overrides byte size.
        this._overridesByteSize += newOverridesBytesSize;
        this.calls.push(c);
        return true;
    }
    get fullness() {
        return Math.max(this.callOpts.gas / this._maxGas, this.bytesSize / this._maxBytes);
    }
    get bytesSize() {
        return this.callOpts.data.length + this._overridesByteSize;
    }
}
function resolveQueuedCall(c, r) {
    if (r.success) {
        c.accept(r.resultData);
    }
    else {
        c.reject(new Error(`EVM call reverted: ${tryDecodeStringRevertErrorResult(r.resultData)}`));
    }
}
function tryDecodeStringRevertErrorResult(rawResultData) {
    if (rawResultData && rawResultData.startsWith('0x08c379a0')) {
        const strLen = new utils_1.BigNumber(utils_1.hexUtils.slice(rawResultData, 4, 36)).toNumber();
        return Buffer.from(utils_1.hexUtils.slice(rawResultData, 68, 68 + strLen).slice(2), 'hex')
            .filter(b => b !== 0)
            .toString();
    }
    return '(no data)';
}
function hashCall(c) {
    var _a, _b;
    return crypto
        .createHash('sha1')
        .update([c.to, c.data, c.gas, (_a = c.gasPrice) === null || _a === void 0 ? void 0 : _a.toString(10), JSON.stringify(c.overrides), (_b = c.value) === null || _b === void 0 ? void 0 : _b.toString(10)].join(','))
        .digest('hex');
}
function chainCalls(
// tslint:disable-next-line: trailing-comma
...fns) {
    return (...args) => {
        let r;
        for (const f of fns) {
            r = f.apply(undefined, args);
        }
        return r;
    };
}
function timeoutAsync(p, timeoutMs, onTimeout) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        const timeoutPromise = new Promise((_accept, reject) => {
            setTimeout(() => {
                const dt = Date.now() - startTime;
                reject(onTimeout(dt));
            }, timeoutMs);
        });
        return Promise.race([p, timeoutPromise]);
    });
}
//# sourceMappingURL=chain.js.map