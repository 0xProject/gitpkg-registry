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
exports.reducePaths = exports.fillsToSortedPaths = exports.findOptimalPathJSAsync = exports.findOptimalRustPathFromSamples = void 0;
const assert_1 = require("@0x/assert");
const neon_router_1 = require("@0x/neon-router");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const perf_hooks_1 = require("perf_hooks");
const types_1 = require("../../types");
const constants_1 = require("../market_operation_utils/constants");
const fills_1 = require("./fills");
const path_1 = require("./path");
const types_2 = require("./types");
// tslint:disable: prefer-for-of custom-no-magic-numbers completed-docs no-bitwise
const RUN_LIMIT_DECAY_FACTOR = 0.5;
// NOTE: The Rust router will panic with less than 3 samples
const MIN_NUM_SAMPLE_INPUTS = 3;
const isDexSample = (obj) => !!obj.source;
function nativeOrderToNormalizedAmounts(side, nativeOrder) {
    const { fillableTakerAmount, fillableTakerFeeAmount, fillableMakerAmount } = nativeOrder;
    const makerAmount = fillableMakerAmount;
    const takerAmount = fillableTakerAmount.plus(fillableTakerFeeAmount);
    const input = side === types_1.MarketOperation.Sell ? takerAmount : makerAmount;
    const output = side === types_1.MarketOperation.Sell ? makerAmount : takerAmount;
    return { input, output };
}
function calculateOuputFee(side, sampleOrNativeOrder, outputAmountPerEth, inputAmountPerEth, fees) {
    var _a, _b;
    if (isDexSample(sampleOrNativeOrder)) {
        const { input, output, source, fillData } = sampleOrNativeOrder;
        const fee = ((_a = fees[source]) === null || _a === void 0 ? void 0 : _a.call(fees, fillData)) || 0;
        const outputFee = fills_1.ethToOutputAmount({
            input,
            output,
            inputAmountPerEth,
            outputAmountPerEth,
            ethAmount: fee,
        });
        return outputFee;
    }
    else {
        const { input, output } = nativeOrderToNormalizedAmounts(side, sampleOrNativeOrder);
        const fee = ((_b = fees[types_2.ERC20BridgeSource.Native]) === null || _b === void 0 ? void 0 : _b.call(fees, sampleOrNativeOrder)) || 0;
        const outputFee = fills_1.ethToOutputAmount({
            input,
            output,
            inputAmountPerEth,
            outputAmountPerEth,
            ethAmount: fee,
        });
        return outputFee;
    }
}
function findRoutesAndCreateOptimalPath(side, samples, nativeOrders, input, opts, fees, neonRouterNumSamples) {
    var _a, _b, _c;
    const createFill = (sample) => {
        const fills = fills_1.dexSamplesToFills(side, [sample], opts.outputAmountPerEth, opts.inputAmountPerEth, fees);
        // NOTE: If the sample has 0 output dexSamplesToFills will return [] because no fill can be created
        if (fills.length === 0) {
            return undefined;
        }
        return fills[0];
    };
    const samplesAndNativeOrdersWithResults = [];
    const serializedPaths = [];
    const sampleSourcePathIds = [];
    for (const singleSourceSamples of samples) {
        if (singleSourceSamples.length === 0) {
            continue;
        }
        const sourcePathId = utils_1.hexUtils.random();
        const singleSourceSamplesWithOutput = [...singleSourceSamples];
        for (let i = singleSourceSamples.length - 1; i >= 0; i--) {
            if (singleSourceSamples[i].output.isZero()) {
                // Remove trailing 0 output samples
                singleSourceSamplesWithOutput.pop();
            }
            else {
                break;
            }
        }
        if (singleSourceSamplesWithOutput.length < MIN_NUM_SAMPLE_INPUTS) {
            continue;
        }
        // TODO(kimpers): Do we need to handle 0 entries, from eg Kyber?
        const serializedPath = singleSourceSamplesWithOutput.reduce((memo, sample, sampleIdx) => {
            memo.ids.push(`${sample.source}-${serializedPaths.length}-${sampleIdx}`);
            memo.inputs.push(sample.input.integerValue().toNumber());
            memo.outputs.push(sample.output.integerValue().toNumber());
            memo.outputFees.push(calculateOuputFee(side, sample, opts.outputAmountPerEth, opts.inputAmountPerEth, fees)
                .integerValue()
                .toNumber());
            return memo;
        }, {
            ids: [],
            inputs: [],
            outputs: [],
            outputFees: [],
        });
        samplesAndNativeOrdersWithResults.push(singleSourceSamplesWithOutput);
        serializedPaths.push(serializedPath);
        sampleSourcePathIds.push(sourcePathId);
    }
    const nativeOrdersourcePathId = utils_1.hexUtils.random();
    for (const [idx, nativeOrder] of nativeOrders.entries()) {
        const { input: normalizedOrderInput, output: normalizedOrderOutput } = nativeOrderToNormalizedAmounts(side, nativeOrder);
        // NOTE: skip dummy order created in swap_quoter
        // TODO: remove dummy order and this logic once we don't need the JS router
        if (normalizedOrderInput.isLessThanOrEqualTo(0) || normalizedOrderOutput.isLessThanOrEqualTo(0)) {
            continue;
        }
        const fee = calculateOuputFee(side, nativeOrder, opts.outputAmountPerEth, opts.inputAmountPerEth, fees)
            .integerValue()
            .toNumber();
        // HACK: due to an issue with the Rust router interpolation we need to create exactly 13 samples from the native order
        const ids = [];
        const inputs = [];
        const outputs = [];
        const outputFees = [];
        for (let i = 1; i <= 13; i++) {
            const fraction = i / 13;
            const currentInput = utils_1.BigNumber.min(normalizedOrderInput.times(fraction), normalizedOrderInput);
            const currentOutput = utils_1.BigNumber.min(normalizedOrderOutput.times(fraction), normalizedOrderOutput);
            const id = `${types_2.ERC20BridgeSource.Native}-${serializedPaths.length}-${idx}-${i}`;
            inputs.push(currentInput.integerValue().toNumber());
            outputs.push(currentOutput.integerValue().toNumber());
            outputFees.push(fee);
            ids.push(id);
        }
        const serializedPath = {
            ids,
            inputs,
            outputs,
            outputFees,
        };
        samplesAndNativeOrdersWithResults.push([nativeOrder]);
        serializedPaths.push(serializedPath);
        sampleSourcePathIds.push(nativeOrdersourcePathId);
    }
    if (serializedPaths.length === 0) {
        return undefined;
    }
    const rustArgs = {
        side,
        targetInput: input.toNumber(),
        pathsIn: serializedPaths,
    };
    const allSourcesRustRoute = new Float64Array(rustArgs.pathsIn.length);
    const strategySourcesOutputAmounts = new Float64Array(rustArgs.pathsIn.length);
    neon_router_1.route(rustArgs, allSourcesRustRoute, strategySourcesOutputAmounts, neonRouterNumSamples);
    assert_1.assert.assert(rustArgs.pathsIn.length === allSourcesRustRoute.length, 'different number of sources in the Router output than the input');
    assert_1.assert.assert(rustArgs.pathsIn.length === strategySourcesOutputAmounts.length, 'different number of sources in the Router output amounts results than the input');
    const routesAndSamplesAndOutputs = _.zip(allSourcesRustRoute, samplesAndNativeOrdersWithResults, strategySourcesOutputAmounts, sampleSourcePathIds);
    const adjustedFills = [];
    const totalRoutedAmount = utils_1.BigNumber.sum(...allSourcesRustRoute);
    const scale = input.dividedBy(totalRoutedAmount);
    for (const [routeInput, routeSamplesAndNativeOrders, outputAmount, sourcePathId] of routesAndSamplesAndOutputs) {
        if (!routeInput || !routeSamplesAndNativeOrders || !outputAmount || !Number.isFinite(outputAmount)) {
            continue;
        }
        // TODO(kimpers): [TKR-241] amounts are sometimes clipped in the router due to precision loss for number/f64
        // we can work around it by scaling it and rounding up. However now we end up with a total amount of a couple base units too much
        const rustInputAdjusted = utils_1.BigNumber.min(new utils_1.BigNumber(routeInput).multipliedBy(scale).integerValue(utils_1.BigNumber.ROUND_CEIL), input);
        const current = routeSamplesAndNativeOrders[routeSamplesAndNativeOrders.length - 1];
        if (!isDexSample(current)) {
            const nativeFill = fills_1.nativeOrdersToFills(side, [current], rustInputAdjusted, opts.outputAmountPerEth, opts.inputAmountPerEth, fees)[0];
            // Note: If the order has an adjusted rate of less than or equal to 0 it will be skipped
            // and nativeFill will be `undefined`
            if (nativeFill) {
                // NOTE: For Limit/RFQ orders we are done here. No need to scale output
                adjustedFills.push(Object.assign(Object.assign({}, nativeFill), { sourcePathId: sourcePathId !== null && sourcePathId !== void 0 ? sourcePathId : utils_1.hexUtils.random() }));
            }
            continue;
        }
        // NOTE: For DexSamples only
        let fill = createFill(current);
        if (!fill) {
            continue;
        }
        const routeSamples = routeSamplesAndNativeOrders;
        // Descend to approach a closer fill for fillData which may not be consistent
        // throughout the path (UniswapV3) and for a closer guesstimate at
        // gas used
        assert_1.assert.assert(routeSamples.length >= 1, 'Found no sample to use for source');
        for (let k = routeSamples.length - 1; k >= 0; k--) {
            if (k === 0) {
                fill = (_a = createFill(routeSamples[0])) !== null && _a !== void 0 ? _a : fill;
            }
            if (rustInputAdjusted.isGreaterThan(routeSamples[k].input)) {
                const left = routeSamples[k];
                const right = routeSamples[k + 1];
                if (left && right) {
                    fill =
                        (_b = createFill(Object.assign(Object.assign({}, right), { input: rustInputAdjusted, output: new utils_1.BigNumber(outputAmount) }))) !== null && _b !== void 0 ? _b : fill;
                }
                else {
                    assert_1.assert.assert(Boolean(left || right), 'No valid sample to use');
                    fill = (_c = createFill(left || right)) !== null && _c !== void 0 ? _c : fill;
                }
                break;
            }
        }
        // TODO(kimpers): remove once we have solved the rounding/precision loss issues in the Rust router
        const maxSampledOutput = utils_1.BigNumber.max(...routeSamples.map(s => s.output));
        const scaleOutput = (output) => utils_1.BigNumber.min(output.times(scale), maxSampledOutput);
        adjustedFills.push(Object.assign(Object.assign({}, fill), { input: rustInputAdjusted, output: scaleOutput(fill.output), adjustedOutput: scaleOutput(fill.adjustedOutput), index: 0, parent: undefined, sourcePathId: sourcePathId !== null && sourcePathId !== void 0 ? sourcePathId : utils_1.hexUtils.random() }));
    }
    if (adjustedFills.length === 0) {
        return undefined;
    }
    const pathFromRustInputs = path_1.Path.create(side, adjustedFills, input, opts);
    return pathFromRustInputs;
}
function findOptimalRustPathFromSamples(side, samples, nativeOrders, input, opts, fees, chainId, neonRouterNumSamples, samplerMetrics) {
    const beforeAllTimeMs = perf_hooks_1.performance.now();
    let beforeTimeMs = perf_hooks_1.performance.now();
    const allSourcesPath = findRoutesAndCreateOptimalPath(side, samples, nativeOrders, input, opts, fees, neonRouterNumSamples);
    // tslint:disable-next-line: no-unused-expression
    samplerMetrics &&
        samplerMetrics.logRouterDetails({
            router: 'neon-router',
            type: 'all',
            timingMs: perf_hooks_1.performance.now() - beforeTimeMs,
        });
    if (!allSourcesPath) {
        return undefined;
    }
    const vipSources = constants_1.VIP_ERC20_BRIDGE_SOURCES_BY_CHAIN_ID[chainId];
    // HACK(kimpers): The Rust router currently doesn't account for VIP sources correctly
    // we need to try to route them in isolation and compare with the results all sources
    if (vipSources.length > 0) {
        beforeTimeMs = perf_hooks_1.performance.now();
        const vipSourcesSet = new Set(vipSources);
        const vipSourcesSamples = samples.filter(s => s[0] && vipSourcesSet.has(s[0].source));
        if (vipSourcesSamples.length > 0) {
            const vipSourcesPath = findRoutesAndCreateOptimalPath(side, vipSourcesSamples, [], input, opts, fees, neonRouterNumSamples);
            // tslint:disable-next-line: no-unused-expression
            samplerMetrics &&
                samplerMetrics.logRouterDetails({
                    router: 'neon-router',
                    type: 'vip',
                    timingMs: perf_hooks_1.performance.now() - beforeTimeMs,
                });
            if (vipSourcesPath === null || vipSourcesPath === void 0 ? void 0 : vipSourcesPath.isBetterThan(allSourcesPath)) {
                return vipSourcesPath;
            }
        }
    }
    // tslint:disable-next-line: no-unused-expression
    samplerMetrics &&
        samplerMetrics.logRouterDetails({
            router: 'neon-router',
            type: 'total',
            timingMs: perf_hooks_1.performance.now() - beforeAllTimeMs,
        });
    return allSourcesPath;
}
exports.findOptimalRustPathFromSamples = findOptimalRustPathFromSamples;
/**
 * Find the optimal mixture of fills that maximizes (for sells) or minimizes
 * (for buys) output, while meeting the input requirement.
 */
function findOptimalPathJSAsync(side, fills, targetInput, runLimit = Math.pow(2, 8), samplerMetrics, opts = path_1.DEFAULT_PATH_PENALTY_OPTS) {
    return __awaiter(this, void 0, void 0, function* () {
        const beforeTimeMs = perf_hooks_1.performance.now();
        // Sort fill arrays by descending adjusted completed rate.
        // Remove any paths which cannot impact the optimal path
        const sortedPaths = reducePaths(fillsToSortedPaths(fills, side, targetInput, opts), side);
        if (sortedPaths.length === 0) {
            return undefined;
        }
        const rates = rateBySourcePathId(sortedPaths);
        let optimalPath = sortedPaths[0];
        for (const [i, path] of sortedPaths.slice(1).entries()) {
            optimalPath = mixPaths(side, optimalPath, path, targetInput, runLimit * Math.pow(RUN_LIMIT_DECAY_FACTOR, i), rates);
            // Yield to event loop.
            yield Promise.resolve();
        }
        const finalPath = optimalPath.isComplete() ? optimalPath : undefined;
        // tslint:disable-next-line: no-unused-expression
        samplerMetrics &&
            samplerMetrics.logRouterDetails({
                router: 'js',
                type: 'total',
                timingMs: perf_hooks_1.performance.now() - beforeTimeMs,
            });
        return finalPath;
    });
}
exports.findOptimalPathJSAsync = findOptimalPathJSAsync;
// Sort fill arrays by descending adjusted completed rate.
function fillsToSortedPaths(fills, side, targetInput, opts) {
    const paths = fills.map(singleSourceFills => path_1.Path.create(side, singleSourceFills, targetInput, opts));
    const sortedPaths = paths.sort((a, b) => {
        const aRate = a.adjustedCompleteRate();
        const bRate = b.adjustedCompleteRate();
        // There is a case where the adjusted completed rate isn't sufficient for the desired amount
        // resulting in a NaN div by 0 (output)
        if (bRate.isNaN()) {
            return -1;
        }
        if (aRate.isNaN()) {
            return 1;
        }
        return bRate.comparedTo(aRate);
    });
    return sortedPaths;
}
exports.fillsToSortedPaths = fillsToSortedPaths;
// Remove paths which have no impact on the optimal path
function reducePaths(sortedPaths, side) {
    // Any path which has a min rate that is less than the best adjusted completed rate has no chance of improving
    // the overall route.
    const bestNonNativeCompletePath = sortedPaths.filter(p => p.isComplete() && p.fills[0].source !== types_2.ERC20BridgeSource.Native)[0];
    // If there is no complete path then just go ahead with the sorted paths
    // I.e if the token only exists on sources which cannot sell to infinity
    // or buys where X is greater than all the tokens available in the pools
    if (!bestNonNativeCompletePath) {
        return sortedPaths;
    }
    const bestNonNativeCompletePathAdjustedRate = bestNonNativeCompletePath.adjustedCompleteRate();
    if (!bestNonNativeCompletePathAdjustedRate.isGreaterThan(0)) {
        return sortedPaths;
    }
    const filteredPaths = sortedPaths.filter(p => p.bestRate().isGreaterThanOrEqualTo(bestNonNativeCompletePathAdjustedRate));
    return filteredPaths;
}
exports.reducePaths = reducePaths;
function mixPaths(side, pathA, pathB, targetInput, maxSteps, rates) {
    const _maxSteps = Math.max(maxSteps, 32);
    let steps = 0;
    // We assume pathA is the better of the two initially.
    let bestPath = pathA;
    const _walk = (path, remainingFills) => {
        steps += 1;
        if (path.isBetterThan(bestPath)) {
            bestPath = path;
        }
        const remainingInput = targetInput.minus(path.size().input);
        if (remainingInput.isGreaterThan(0)) {
            for (let i = 0; i < remainingFills.length && steps < _maxSteps; ++i) {
                const fill = remainingFills[i];
                // Only walk valid paths.
                if (!path.isValidNextFill(fill)) {
                    continue;
                }
                // Remove this fill from the next list of candidate fills.
                const nextRemainingFills = remainingFills.slice();
                nextRemainingFills.splice(i, 1);
                // Recurse.
                _walk(path_1.Path.clone(path).append(fill), nextRemainingFills);
            }
        }
    };
    const allFills = [...pathA.fills, ...pathB.fills];
    // Sort subpaths by rate and keep fills contiguous to improve our
    // chances of walking ideal, valid paths first.
    const sortedFills = allFills.sort((a, b) => {
        if (a.sourcePathId !== b.sourcePathId) {
            return rates[b.sourcePathId].comparedTo(rates[a.sourcePathId]);
        }
        return a.index - b.index;
    });
    _walk(path_1.Path.create(side, [], targetInput, pathA.pathPenaltyOpts), sortedFills);
    if (!bestPath.isValid()) {
        throw new Error('nooope');
    }
    return bestPath;
}
function rateBySourcePathId(paths) {
    return _.fromPairs(paths.map(p => [p.fills[0].sourcePathId, p.adjustedRate()]));
}
//# sourceMappingURL=path_optimizer.js.map