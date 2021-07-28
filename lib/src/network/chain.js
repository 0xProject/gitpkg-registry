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
const DEFAULT_CALL_GAS_LIMIT = 4e6;
const DEFAULT_CALLER_ADDRESS = utils_1.hexUtils.random(20);
const DISPATCHER_CONTRACT_ADDRESS = utils_1.hexUtils.random(20);
const DISPATCHER_CONTRACT_BYTECODE = artifacts_1.artifacts.CallDispatcher.compilerOutput.evm.deployedBytecode.object;
const DISPATCHER_CONTRACT = new wrappers_1.CallDispatcherContract(DISPATCHER_CONTRACT_ADDRESS, constants_1.DUMMY_PROVIDER, {}, {}, DISPATCHER_CONTRACT_BYTECODE, fast_abi_1.createFastAbiEncoderOverrides(wrappers_1.CallDispatcherContract));
class LiveChain {
    constructor(opts) {
        this._cachedCallResults = {};
        this._queue = [];
        // How many outstanding eth_calls there are.
        this._outstandingCalls = [];
        // How "full" the queue is.
        this._queueFullness = 0;
        // The last block number returned by a dispatch call.
        this._blockNumber = 0;
        this._chainId = opts.chainId;
        this._w3 = opts.w3;
        this._maxCacheAgeMs = opts.maxCacheAgeMs;
        this._callTimeoutMs = opts.callTimeoutMs;
        this._maxBatchGas = opts.maxBatchGas;
        this._maxBatchBytes = opts.maxBatchBytes;
        this._targetFullness = opts.targetFullness;
        this._minOutstandingCalls = opts.minOutstandingCalls;
    }
    get provider() {
        return this._w3.getProvider();
    }
    get chainId() {
        return this._chainId;
    }
    get blockNumber() {
        return this._blockNumber;
    }
    static createAsync(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullOpts = Object.assign({ maxCacheAgeMs: 600e3, pruneFrequencyMs: 5e3, callTimeoutMs: 5e3, 
                // These numbers will all affect how calls are batched across
                // RPC calls.
                flushFrequencyMs: 100, maxBatchGas: 1e9, maxBatchBytes: 0.750e6, targetFullness: 2, minOutstandingCalls: 2 }, opts);
            const w3 = new web3_wrapper_1.Web3Wrapper(opts.provider);
            const chainId = (yield w3.getChainIdAsync());
            const inst = new LiveChain(Object.assign({ chainId,
                w3 }, fullOpts));
            void inst._flushAsync(fullOpts.flushFrequencyMs);
            inst._prune(fullOpts.pruneFrequencyMs);
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
                const cachedResult = this._findCachedCallResult(c.id, opts.maxCacheAgeMs);
                if (cachedResult) {
                    console.log(`[DEBUG] cache hit ${c.id}`);
                    resolveQueuedCall(c, cachedResult);
                    return p;
                }
                // Cache both success and failure results.
                p.then(resultData => this._cacheCallResult(c.id, resultData)).catch(error => {
                    // Only cache reverts.
                    if (error.message && error.message.indexOf('reverted') !== -1) {
                        this._cacheCallResult(c.id, undefined, error);
                    }
                });
            }
            if (opts.timeoutMs) {
                void (() => __awaiter(this, void 0, void 0, function* () { return setTimeout(() => c.reject(new Error('ethCall timed out')), opts.timeoutMs); }))();
            }
            if (opts.immediate) {
                // Do not add to queue. Dispatch immediately.
                void this._dispatchBatchAsync([c]);
            }
            else {
                // Just queue up and batch dispatch later.
                this._queueCall(c);
            }
            return p;
        });
    }
    _queueCall(c) {
        // Check for duplicate calls already in the queue.
        for (const q of this._queue) {
            if (q.id === c.id) {
                // Found a duplicate. Just chain the callbacks on the existing one.
                q.accept = chainCalls(q.accept, c.accept);
                q.reject = chainCalls(q.reject, c.reject);
                return;
            }
        }
        this._queue.push(c);
        this._queueFullness += getCallFullness(c, this._maxBatchGas, this._maxBatchBytes);
    }
    _findCachedCallResult(callId, maxCacheAgeMs) {
        const cached = this._cachedCallResults[callId];
        if (cached && Date.now() - cached.cacheTimeMs < (maxCacheAgeMs || 0)) {
            return cached.result;
        }
        return;
    }
    _cacheCallResult(callId, successResult, error) {
        this._cachedCallResults[callId] = {
            cacheTimeMs: Date.now(),
            result: {
                success: !error,
                resultData: error || successResult,
            },
        };
    }
    _flushAsync(frequency) {
        return __awaiter(this, void 0, void 0, function* () {
            let nextFlushTime = Date.now() + frequency;
            const maxBatches = Math.max(0, this._minOutstandingCalls +
                Math.round(this._queueFullness / this._targetFullness)
                - this._outstandingCalls.length);
            const batches = utils_2.timeIt(() => this._generateCallBatches(maxBatches), dt => `_generateCallBatches took ${dt}ms`);
            const dispatchPromises = batches.map(b => this._dispatchBatchAsync(b));
            this._outstandingCalls.push(...dispatchPromises);
            for (const p of dispatchPromises) {
                p.finally(() => {
                    this._outstandingCalls = this._outstandingCalls.filter(_p => p !== _p);
                });
            }
            if (this._outstandingCalls.length) {
                yield Promise.race(this._outstandingCalls);
            }
            setTimeout(() => this._flushAsync(frequency), Math.max(0, nextFlushTime - Date.now()));
        });
    }
    _prune(frequency) {
        utils_2.timeIt(() => this._pruneCache(), dt => `pruneCache took ${dt}ms`);
        setTimeout(() => __awaiter(this, void 0, void 0, function* () { return this._prune(frequency); }), frequency);
    }
    _pruneCache() {
        const now = Date.now();
        for (const id in this._cachedCallResults) {
            if (now - this._cachedCallResults[id].cacheTimeMs >= this._maxCacheAgeMs) {
                delete this._cachedCallResults[id];
            }
        }
    }
    _dispatchBatchAsync(calls) {
        return __awaiter(this, void 0, void 0, function* () {
            if (calls.length === 0) {
                return;
            }
            const rejectBatch = (err) => {
                calls.forEach(c => c.reject(err));
            };
            let rawResultData;
            const mergedCalls = mergeBatchCalls(calls);
            try {
                rawResultData = yield utils_2.timeItAsync(() => timeoutAsync(this._w3.callAsync(mergedCalls), this._callTimeoutMs, () => new Error(`callAsync took too long`)), dt => {
                    const kbSize = (mergedCalls.data.length + Object.values(mergedCalls.overrides).map(o => o.code.length).reduce((a, v) => a + v, 0)) / 1024;
                    return `callAsync took ${dt}ms (${kbSize}kb) (${mergedCalls.gas / 1e6}M gas)`;
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
            if (calls.length === 1) {
                // Direct call (not batched).
                return calls[0].accept(rawResultData);
            }
            const [results, blockNumber] = DISPATCHER_CONTRACT.getABIDecodedReturnData('dispatch', rawResultData);
            if (results.length !== calls.length) {
                rejectBatch(new Error(`Expected dispatcher result to be the same length as number of calls`));
                return;
            }
            this._blockNumber = Math.max(blockNumber.toNumber(), this._blockNumber);
            // resolve each call in the batch.
            results.forEach((r, i) => resolveQueuedCall(calls[i], r));
        });
    }
    _generateCallBatches(maxBatches = 8) {
        if (maxBatches === 0) {
            return [];
        }
        const batch = [];
        let nextQueue = this._queue;
        while (batch.length < maxBatches && nextQueue.length > 0) {
            const _queue = nextQueue;
            nextQueue = [];
            const batcher = new CallBatcher(this._maxBatchGas, this._maxBatchBytes);
            // Go through each call in the queue and try to batch it.
            for (const c of _queue) {
                if (!batcher.tryToBatch(c)) {
                    // Couldn't batch it so return to the queue.
                    nextQueue.push(c);
                }
            }
            if (batcher.length === 0) {
                // Nothing to batch. Stop.
                break;
            }
            const batchFullness = batcher.calls
                .map(c => getCallFullness(c, this._maxBatchGas, this._maxBatchBytes))
                .reduce((a, v) => a + v, 0);
            this._queueFullness -= batchFullness;
            batch.push(batcher.calls);
        }
        // Whatever left over is our new queue.
        this._queue = nextQueue;
        return batch;
    }
}
exports.LiveChain = LiveChain;
class CallBatcher {
    constructor(_maxBatchGas, _maxBatchBytes) {
        this._maxBatchGas = _maxBatchGas;
        this._maxBatchBytes = _maxBatchBytes;
        this.calls = [];
        this._batchGas = 0;
        this._batchBytesSize = 0;
        this._batchOverrides = {};
    }
    get length() {
        return this.calls.length;
    }
    tryToBatch(ethCall) {
        var _a, _b;
        let estimatedBytesSize = ethCall.opts.data.length;
        if (ethCall.opts.overrides) {
            for (const a in ethCall.opts.overrides) {
                if (!(a in this._batchOverrides)) {
                    estimatedBytesSize += (ethCall.opts.overrides[a].code || '').length;
                }
            }
        }
        if (this.calls.length !== 0) {
            // Total batch gas limit must not be too large.
            if ((ethCall.opts.gas || DEFAULT_CALL_GAS_LIMIT) + this._batchGas >= this._maxBatchGas) {
                return false;
            }
            // Gas prices must not conflict.
            if (this._batchGasPrice && ethCall.opts.gasPrice && !ethCall.opts.gasPrice.eq(this._batchGasPrice)) {
                return false;
            }
            // Overrides must not conflict.
            if (ethCall.opts.overrides) {
                for (const addr in ethCall.opts.overrides) {
                    if (addr in this._batchOverrides) {
                        if (((_a = this._batchOverrides[addr]) === null || _a === void 0 ? void 0 : _a.code) !== ((_b = ethCall.opts.overrides[addr]) === null || _b === void 0 ? void 0 : _b.code)) {
                            return false;
                        }
                    }
                }
            }
            // Total batch bytes size must not be too large.
            if (this._batchBytesSize + estimatedBytesSize >= this._maxBatchBytes) {
                return false;
            }
        }
        this._batchGas += ethCall.opts.gas || DEFAULT_CALL_GAS_LIMIT;
        this._batchGasPrice = ethCall.opts.gasPrice ? ethCall.opts.gasPrice : this._batchGasPrice;
        this._batchBytesSize += estimatedBytesSize;
        Object.assign(this._batchOverrides, ethCall.opts.overrides || {});
        this.calls.push(ethCall);
        return true;
    }
}
function mergeBatchCalls(calls) {
    return utils_2.timeIt(() => {
        if (calls.length === 1) {
            // If we just have one call, don't bother batching it.
            return {
                gas: calls[0].opts.gas || DEFAULT_CALL_GAS_LIMIT,
                from: DEFAULT_CALLER_ADDRESS,
                gasPrice: calls[0].opts.gasPrice || constants_1.ZERO_AMOUNT,
                to: calls[0].opts.to,
                value: calls[0].opts.value || constants_1.ZERO_AMOUNT,
                data: calls[0].opts.data,
                overrides: calls[0].opts.overrides || {},
            };
        }
        const callInfos = [];
        const merged = {
            gas: calls.length * 20e3,
            from: DEFAULT_CALLER_ADDRESS,
            gasPrice: undefined,
            to: DISPATCHER_CONTRACT.address,
            value: constants_1.ZERO_AMOUNT,
            data: constants_1.NULL_BYTES,
            overrides: { [DISPATCHER_CONTRACT_ADDRESS]: { code: DISPATCHER_CONTRACT_BYTECODE } },
        };
        for (const c of calls) {
            callInfos.push({
                data: c.opts.data,
                to: c.opts.to,
                gas: new utils_1.BigNumber(c.opts.gas || DEFAULT_CALL_GAS_LIMIT),
                value: c.opts.value || constants_1.ZERO_AMOUNT,
            });
            merged.gas += c.opts.gas || DEFAULT_CALL_GAS_LIMIT;
            merged.gasPrice = merged.gasPrice === undefined ? c.opts.gasPrice : merged.gasPrice;
            if (c.opts.value) {
                merged.value = merged.value === constants_1.ZERO_AMOUNT
                    ? c.opts.value || constants_1.ZERO_AMOUNT
                    : merged.value.plus(c.opts.value || constants_1.ZERO_AMOUNT);
            }
            if (c.opts.overrides) {
                for (const addr in c.opts.overrides) {
                    merged.overrides[addr] = c.opts.overrides[addr];
                }
            }
        }
        return Object.assign(Object.assign({}, merged), { data: DISPATCHER_CONTRACT.dispatch(callInfos).getABIEncodedTransactionData(), gasPrice: merged.gasPrice || constants_1.ZERO_AMOUNT });
    }, dt => `mergeBatchCalls took ${dt}ms`);
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
function getCallFullness(c, maxBatchGas, maxBatchBytes) {
    return Math.max((c.opts.gas || DEFAULT_CALL_GAS_LIMIT) / maxBatchGas, 
    // This is just a rough metric so no need to include overrides size.
    c.opts.data.length / maxBatchBytes);
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