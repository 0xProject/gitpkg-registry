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
const utils_2 = require("../utils/utils");
const constants_1 = require("./constants");
const fast_abi_1 = require("./fast_abi");
const DEFAULT_CALL_GAS_LIMIT = 32e6;
const DEFAULT_CALLER_ADDRESS = utils_1.hexUtils.random(20);
const DISPATCHER_CONTRACT_ADDRESS = utils_1.hexUtils.random(20);
const DISPATCHER_CONTRACT_BYTECODE = artifacts_1.artifacts.CallDispatcher.compilerOutput.evm.deployedBytecode.object;
const DISPATCHER_CONTRACT = new wrappers_1.CallDispatcherContract(DISPATCHER_CONTRACT_ADDRESS, constants_1.DUMMY_PROVIDER, {}, {}, DISPATCHER_CONTRACT_BYTECODE, fast_abi_1.createFastAbiEncoderOverrides(wrappers_1.CallDispatcherContract));
class LiveChain {
    constructor(chainId, w3, maxCacheAgeMs) {
        this._cachedCallResults = {};
        this._maxCacheAgeMs = 0;
        this._tickTimer = null;
        this._queue = [];
        this._chainId = chainId;
        this._w3 = w3;
        this._maxCacheAgeMs = maxCacheAgeMs;
    }
    get provider() {
        return this._w3.getProvider();
    }
    get chainId() {
        return this._chainId;
    }
    static createAsync(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullOpts = Object.assign({ tickFrequency: 100, maxCacheAgeMs: 30e3 }, opts);
            const w3 = new web3_wrapper_1.Web3Wrapper(opts.provider);
            const chainId = (yield w3.getChainIdAsync());
            const inst = new LiveChain(chainId, w3, fullOpts.maxCacheAgeMs);
            yield inst._startAsync(fullOpts.tickFrequency);
            return inst;
        });
    }
    static _mergeBatchCalls(calls) {
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
        const callInfos = calls.map(c => ({
            data: c.opts.data,
            to: c.opts.to,
            gas: new utils_1.BigNumber(c.opts.gas || 0),
            value: c.opts.value || constants_1.ZERO_AMOUNT,
        }));
        return {
            gas: calls.reduce((s, c) => (c.opts.gas || DEFAULT_CALL_GAS_LIMIT) + s, 0) || DEFAULT_CALL_GAS_LIMIT,
            from: DEFAULT_CALLER_ADDRESS,
            gasPrice: utils_1.BigNumber.sum(...calls.map(c => c.opts.gasPrice || 0)),
            to: DISPATCHER_CONTRACT.address,
            value: utils_1.BigNumber.sum(...calls.map(c => c.opts.value || 0)),
            data: DISPATCHER_CONTRACT.dispatch(callInfos).getABIEncodedTransactionData(),
            overrides: Object.assign({ [DISPATCHER_CONTRACT.address]: { code: DISPATCHER_CONTRACT_BYTECODE } }, ...calls.map(c => c.opts.overrides)),
        };
    }
    _startAsync(tickFrequency) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._tickAsync(tickFrequency, true);
        });
    }
    ethCallAsync(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let c;
            const p = new Promise((accept, reject) => {
                // This executes right away so `c` will be defined in this fn.
                c = {
                    opts,
                    accept,
                    reject,
                };
            });
            if (opts.maxCacheAgeMs) {
                // Check the cache.
                const cachedResult = this._findCachedCallResult(c.opts);
                if (cachedResult) {
                    resolveQueuedCall(c, cachedResult);
                    return p;
                }
                // Cache both success and failure results.
                p.then(resultData => this._cacheCallResult(c.opts, resultData)).catch(error => this._cacheCallResult(c.opts, undefined, error));
            }
            if (opts.immediate) {
                // Do not add to queue. Dispatch immediately.
                void this._executeAsync([c]);
            }
            else {
                // Just queue up and batch dispatch later.
                this._queue.push(c);
            }
            return p;
        });
    }
    _findCachedCallResult(c) {
        const cached = this._cachedCallResults[hashCall(c)];
        if (cached && Date.now() - cached.cacheTimeMs < (c.maxCacheAgeMs || 0)) {
            return cached.result;
        }
        return;
    }
    _cacheCallResult(c, successResult, error) {
        this._cachedCallResults[hashCall(c)] = {
            cacheTimeMs: Date.now(),
            result: {
                success: !!error,
                resultData: error || successResult,
            },
        };
    }
    _tickAsync(tickFrequency, bootstrap = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bootstrap && !this._tickTimer) {
                return;
            }
            this._tickTimer = null;
            this._pruneCache();
            {
                const queue = this._queue;
                this._queue = [];
                void this._executeAsync(queue);
            }
            this._tickTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () { return this._tickAsync(tickFrequency); }), tickFrequency);
        });
    }
    _pruneCache() {
        const now = Date.now();
        for (const id in this._cachedCallResults) {
            if (now - this._cachedCallResults[id].cacheTimeMs >= this._maxCacheAgeMs) {
                delete this._cachedCallResults[id];
            }
        }
    }
    _executeAsync(queue) {
        return __awaiter(this, void 0, void 0, function* () {
            // dispatch each batch of calls.
            return utils_2.timeIt(() => __awaiter(this, void 0, void 0, function* () {
                const batches = yield utils_2.timeIt(() => [...generateCallBatches(queue)], 'generateCallBatches');
                yield Promise.all(batches.map((b) => __awaiter(this, void 0, void 0, function* () { return this._dispatchBatchAsync(b); })));
            }), 'LiveChain._executeAsync,');
        });
    }
    _dispatchBatchAsync(calls) {
        return __awaiter(this, void 0, void 0, function* () {
            const rejectBatch = (err) => {
                calls.forEach(c => c.reject(err));
            };
            let rawResultData;
            const merged = LiveChain._mergeBatchCalls(calls);
            try {
                rawResultData = yield utils_2.timeIt(() => __awaiter(this, void 0, void 0, function* () { return this._w3.callAsync(merged); }), 'eth_call', 250, () => {
                    const numOverrides = Object.keys(merged.overrides).length;
                    const overridesSize = Object.values(merged.overrides)
                        .map(v => v.code || '')
                        .reduce((a, v) => v.length + a, 0) / 1e3;
                    const dataSize = merged.data.length / 1e3;
                    console.info(`\tnum calls: ${calls.length}, num overrides: ${numOverrides}, sizes: ${overridesSize}/${dataSize} kb`);
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
            const results = DISPATCHER_CONTRACT.getABIDecodedReturnData('dispatch', rawResultData);
            if (results.length !== calls.length) {
                rejectBatch(`Expected dispatcher result to be the same length as number of calls`);
                return;
            }
            // resolve each call in the batch.
            results.forEach((r, i) => resolveQueuedCall(calls[i], r));
        });
    }
}
exports.LiveChain = LiveChain;
function* generateCallBatches(queue) {
    let nextQueue = queue;
    while (nextQueue.length > 0) {
        const _queue = nextQueue;
        nextQueue = [];
        const batch = [];
        for (const c of _queue) {
            if (canBatchCallWith(c, batch)) {
                batch.push(c);
            }
            else {
                nextQueue.push(c);
            }
        }
        yield batch;
    }
}
function resolveQueuedCall(c, r) {
    if (r.success) {
        c.accept(r.resultData);
    }
    else {
        c.reject(tryDecodeStringRevertErrorResult(r.resultData) || `EVM call reverted: ${r.resultData}`);
    }
}
function tryDecodeStringRevertErrorResult(rawResultData) {
    if (rawResultData.startsWith('0x08c379a0')) {
        const strLen = new utils_1.BigNumber(utils_1.hexUtils.slice(rawResultData, 4, 36)).toNumber();
        return Buffer.from(utils_1.hexUtils.slice(rawResultData, 68, 68 + strLen).slice(2), 'hex').toString();
    }
    return;
}
function canBatchCallWith(ethCall, batch) {
    if (batch.length === 0) {
        return true;
    }
    // TODO: have the sources provide realistic gas limits and split based on that.
    if (batch.length >= 32) {
        return false;
    }
    const { overrides, gasPrice } = Object.assign({ overrides: {} }, ethCall.opts);
    const batchOverrides = Object.assign({}, ...batch.map(b => b.opts.overrides || {}));
    // Split if the estimated RPC payload size would be too large.
    {
        let estimatedRpcSize = ethCall.opts.data.length;
        for (const c of batch) {
            estimatedRpcSize += c.opts.data.length;
        }
        for (const a in overrides) {
            estimatedRpcSize += (ethCall.opts.overrides[a].code || '').length;
        }
        for (const a in batchOverrides) {
            if (!(a in overrides)) {
                estimatedRpcSize += (batchOverrides[a].code || '').length;
            }
        }
        if (estimatedRpcSize >= 512e3) {
            return false;
        }
    }
    // Overrides must not conflict.
    for (const addr in overrides) {
        const a = overrides[addr];
        const b = batchOverrides[addr];
        if (a && b && a.code !== b.code) {
            return false;
        }
    }
    // Gas prices must not be in conflict.
    const batchGasPriceIfExists = batch.filter(b => b.opts.gasPrice).map(b => b.opts.gasPrice)[0];
    if (batchGasPriceIfExists && gasPrice && !gasPrice.eq(batchGasPriceIfExists)) {
        return false;
    }
    return true;
}
function hashCall(c) {
    return crypto
        .createHash('sha1')
        .update(JSON.stringify(c))
        .digest('hex');
}
//# sourceMappingURL=chain.js.map