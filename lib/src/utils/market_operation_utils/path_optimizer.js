"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOptimalPathFromSamples = void 0;
const assert_1 = require("@0x/assert");
const neon_router_1 = require("@0x/neon-router");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const perf_hooks_1 = require("perf_hooks");
const constants_1 = require("../../constants");
const types_1 = require("../../types");
const constants_2 = require("./constants");
const fills_1 = require("./fills");
const path_1 = require("./path");
const types_2 = require("./types");
// tslint:disable: prefer-for-of custom-no-magic-numbers completed-docs no-bitwise
// NOTE: The Rust router will panic with less than 3 samples
const MIN_NUM_SAMPLE_INPUTS = 3;
const isDexSample = (obj) => !!obj.source;
const ONE_BASE_UNIT = new utils_1.BigNumber(1);
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
        const fee = ((_a = fees[source]) === null || _a === void 0 ? void 0 : _a.call(fees, fillData).fee) || constants_2.ZERO_AMOUNT;
        const outputFee = (0, fills_1.ethToOutputAmount)({
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
        const fee = ((_b = fees[types_2.ERC20BridgeSource.Native]) === null || _b === void 0 ? void 0 : _b.call(fees, sampleOrNativeOrder).fee) || constants_2.ZERO_AMOUNT;
        const outputFee = (0, fills_1.ethToOutputAmount)({
            input,
            output,
            inputAmountPerEth,
            outputAmountPerEth,
            ethAmount: fee,
        });
        return outputFee;
    }
}
function findRoutesAndCreateOptimalPath(side, samples, nativeOrders, input, opts, fees, neonRouterNumSamples, vipSourcesSet, fillAdjustor) {
    var _a;
    // Currently the rust router is unable to handle 1 base unit sized quotes and will error out
    // To avoid flooding the logs with these errors we just return an insufficient liquidity error
    // which is how the JS router handles these quotes today
    if (input.isLessThanOrEqualTo(ONE_BASE_UNIT)) {
        return undefined;
    }
    // Create a `Fill` from a dex sample and adjust it with any passed in
    // adjustor
    const createFillFromDexSample = (sample) => {
        const fill = (0, fills_1.dexSampleToFill)(side, sample, opts.outputAmountPerEth, opts.inputAmountPerEth, fees);
        const adjustedFills = fillAdjustor.adjustFills(side, [fill], input);
        return adjustedFills[0];
    };
    const createPathFromStrategy = (optimalRouteInputs, optimalRouteOutputs) => {
        /**
         * inputs are the amounts to fill at each source index
         * e.g fill 2076 at index 4
         *  [ 0, 0, 0, 0, 2076, 464, 230,
         *    230, 0, 0, 0 ]
         *  the sum represents the total input amount
         *
         *  outputs are the amounts we expect out at each source index
         *  [ 0, 0, 0, 0, 42216, 9359, 4677,
         *    4674, 0, 0, 0 ]
         *  the sum represents the total expected output amount
         */
        var _a, _b, _c;
        const routesAndSamplesAndOutputs = _.zip(optimalRouteInputs, optimalRouteOutputs, samplesAndNativeOrdersWithResults, sampleSourcePathIds);
        const adjustedFills = [];
        const totalRoutedAmount = utils_1.BigNumber.sum(...optimalRouteInputs);
        // Due to precision errors we can end up with a totalRoutedAmount that is not exactly equal to the input
        const precisionErrorScalar = input.dividedBy(totalRoutedAmount);
        for (const [routeInput, outputAmount, routeSamplesAndNativeOrders, sourcePathId,] of routesAndSamplesAndOutputs) {
            if (!Number.isFinite(outputAmount)) {
                (0, constants_1.DEFAULT_WARNING_LOGGER)(rustArgs, `neon-router: invalid route outputAmount ${outputAmount}`);
                return undefined;
            }
            if (!routeInput || !routeSamplesAndNativeOrders || !outputAmount) {
                continue;
            }
            // TODO: [TKR-241] amounts are sometimes clipped in the router due to precision loss for number/f64
            // we can work around it by scaling it and rounding up. However now we end up with a total amount of a couple base units too much
            const routeInputCorrected = utils_1.BigNumber.min(precisionErrorScalar.multipliedBy(routeInput).integerValue(utils_1.BigNumber.ROUND_CEIL), input);
            const current = routeSamplesAndNativeOrders[routeSamplesAndNativeOrders.length - 1];
            // If it is a native single order we only have one Input/output
            // we want to convert this to an array of samples
            if (!isDexSample(current)) {
                const nativeFill = (0, fills_1.nativeOrderToFill)(side, current, routeInputCorrected, opts.outputAmountPerEth, opts.inputAmountPerEth, fees, false);
                // Note: If the order has an adjusted rate of less than or equal to 0 it will be undefined
                if (nativeFill) {
                    // NOTE: For Limit/RFQ orders we are done here. No need to scale output
                    adjustedFills.push(Object.assign(Object.assign({}, nativeFill), { sourcePathId: sourcePathId !== null && sourcePathId !== void 0 ? sourcePathId : utils_1.hexUtils.random() }));
                }
                continue;
            }
            // NOTE: For DexSamples only
            let fill = createFillFromDexSample(current);
            if (!fill) {
                continue;
            }
            const routeSamples = routeSamplesAndNativeOrders;
            // From the output of the router, find the closest Sample in terms of input.
            // The Router may have chosen an amount to fill that we do not have a measured sample of
            // Choosing this accurately is required in some sources where the `FillData` may change depending
            // on the size of the trade. For example, UniswapV3 has variable gas cost
            // which increases with input.
            assert_1.assert.assert(routeSamples.length >= 1, 'Found no sample to use for source');
            for (let k = routeSamples.length - 1; k >= 0; k--) {
                // If we're at the last remaining sample that's all we have left to use
                if (k === 0) {
                    fill = (_a = createFillFromDexSample(routeSamples[0])) !== null && _a !== void 0 ? _a : fill;
                }
                if (routeInputCorrected.isGreaterThan(routeSamples[k].input)) {
                    const left = routeSamples[k];
                    const right = routeSamples[k + 1];
                    if (left && right) {
                        fill =
                            (_b = createFillFromDexSample(Object.assign(Object.assign({}, right), { input: routeInputCorrected, output: new utils_1.BigNumber(outputAmount).integerValue() }))) !== null && _b !== void 0 ? _b : fill;
                    }
                    else {
                        assert_1.assert.assert(Boolean(left || right), 'No valid sample to use');
                        fill = (_c = createFillFromDexSample(left || right)) !== null && _c !== void 0 ? _c : fill;
                    }
                    break;
                }
            }
            // TODO: remove once we have solved the rounding/precision loss issues in the Rust router
            const maxSampledOutput = utils_1.BigNumber.max(...routeSamples.map(s => s.output)).integerValue();
            // Scale output by scale factor but never go above the largest sample in sell quotes (unknown liquidity)  or below 1 base unit (unfillable)
            const scaleOutput = (output) => {
                const capped = utils_1.BigNumber.min(output.integerValue(), maxSampledOutput);
                return utils_1.BigNumber.max(capped, 1);
            };
            adjustedFills.push(Object.assign(Object.assign({}, fill), { input: routeInputCorrected, output: scaleOutput(fill.output), adjustedOutput: scaleOutput(fill.adjustedOutput), sourcePathId: sourcePathId !== null && sourcePathId !== void 0 ? sourcePathId : utils_1.hexUtils.random() }));
        }
        if (adjustedFills.length === 0) {
            return undefined;
        }
        const pathFromRustInputs = path_1.Path.create(side, adjustedFills, input, opts);
        return pathFromRustInputs;
    };
    const samplesAndNativeOrdersWithResults = [];
    const serializedPaths = [];
    const sampleSourcePathIds = [];
    for (const singleSourceSamples of samples) {
        if (singleSourceSamples.length === 0) {
            continue;
        }
        const singleSourceSamplesWithOutput = [...singleSourceSamples];
        for (let i = singleSourceSamples.length - 1; i >= 0; i--) {
            const currentOutput = singleSourceSamples[i].output;
            if (currentOutput.isZero() || !currentOutput.isFinite()) {
                // Remove trailing 0/invalid output samples
                singleSourceSamplesWithOutput.pop();
            }
            else {
                break;
            }
        }
        if (singleSourceSamplesWithOutput.length < MIN_NUM_SAMPLE_INPUTS) {
            continue;
        }
        // TODO: Do we need to handle 0 entries, from eg Kyber?
        const serializedPath = singleSourceSamplesWithOutput.reduce((memo, sample, sampleIdx) => {
            // Use the fill from createFillFromDexSample to apply
            // any user supplied adjustments
            const f = createFillFromDexSample(sample);
            memo.ids.push(`${f.source}-${serializedPaths.length}-${sampleIdx}`);
            memo.inputs.push(f.input.integerValue().toNumber());
            memo.outputs.push(f.output.integerValue().toNumber());
            // Calculate the penalty of this sample as the diff between the
            // output and the adjusted output
            const outputFee = f.output
                .minus(f.adjustedOutput)
                .absoluteValue()
                .integerValue()
                .toNumber();
            memo.outputFees.push(outputFee);
            return memo;
        }, {
            ids: [],
            inputs: [],
            outputs: [],
            outputFees: [],
            isVip: vipSourcesSet.has((_a = singleSourceSamplesWithOutput[0]) === null || _a === void 0 ? void 0 : _a.source),
        });
        samplesAndNativeOrdersWithResults.push(singleSourceSamplesWithOutput);
        serializedPaths.push(serializedPath);
        const sourcePathId = utils_1.hexUtils.random();
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
        // NOTE: Limit orders can be both larger or smaller than the input amount
        // If the order is larger than the input we can scale the order to the size of
        // the quote input (order pricing is constant) and then create 13 "samples" up to
        // and including the full quote input amount.
        // If the order is smaller we don't need to scale anything, we will just end up
        // with trailing duplicate samples for the order input as we cannot go higher
        const scaleToInput = utils_1.BigNumber.min(input.dividedBy(normalizedOrderInput), 1);
        for (let i = 1; i <= 13; i++) {
            const fraction = i / 13;
            const currentInput = utils_1.BigNumber.min(normalizedOrderInput.times(scaleToInput).times(fraction), normalizedOrderInput);
            const currentOutput = utils_1.BigNumber.min(normalizedOrderOutput.times(scaleToInput).times(fraction), normalizedOrderOutput);
            const id = `${types_2.ERC20BridgeSource.Native}-${nativeOrder.type}-${serializedPaths.length}-${idx}-${i}`;
            inputs.push(currentInput.integerValue().toNumber());
            outputs.push(currentOutput.integerValue().toNumber());
            outputFees.push(fee);
            ids.push(id);
        }
        // We have a VIP for the Rfq order type, Limit order currently goes through FQT
        const isVip = nativeOrder.type !== protocol_utils_1.FillQuoteTransformerOrderType.Limit;
        const serializedPath = {
            ids,
            inputs,
            outputs,
            outputFees,
            isVip,
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
    const allSourcesOutputAmounts = new Float64Array(rustArgs.pathsIn.length);
    const vipSourcesRustRoute = new Float64Array(rustArgs.pathsIn.length);
    const vipSourcesOutputAmounts = new Float64Array(rustArgs.pathsIn.length);
    (0, neon_router_1.route)(rustArgs, allSourcesRustRoute, allSourcesOutputAmounts, vipSourcesRustRoute, vipSourcesOutputAmounts, neonRouterNumSamples);
    assert_1.assert.assert(rustArgs.pathsIn.length === allSourcesRustRoute.length, 'different number of sources in the Router output than the input');
    assert_1.assert.assert(rustArgs.pathsIn.length === allSourcesOutputAmounts.length, 'different number of sources in the Router output amounts results than the input');
    assert_1.assert.assert(rustArgs.pathsIn.length === vipSourcesRustRoute.length, 'different number of sources in the Router output than the input');
    assert_1.assert.assert(rustArgs.pathsIn.length === vipSourcesOutputAmounts.length, 'different number of sources in the Router output amounts results than the input');
    const allSourcesPath = createPathFromStrategy(allSourcesRustRoute, allSourcesOutputAmounts);
    const vipSourcesPath = createPathFromStrategy(vipSourcesRustRoute, vipSourcesOutputAmounts);
    return {
        allSourcesPath,
        vipSourcesPath,
    };
}
function findOptimalPathFromSamples(side, samples, nativeOrders, input, opts, fees, chainId, neonRouterNumSamples, fillAdjustor, samplerMetrics) {
    const beforeTimeMs = perf_hooks_1.performance.now();
    const sendMetrics = () => {
        // tslint:disable-next-line: no-unused-expression
        samplerMetrics &&
            samplerMetrics.logRouterDetails({
                router: 'neon-router',
                type: 'total',
                timingMs: perf_hooks_1.performance.now() - beforeTimeMs,
            });
    };
    const vipSourcesSet = new Set(constants_2.VIP_ERC20_BRIDGE_SOURCES_BY_CHAIN_ID[chainId]);
    const paths = findRoutesAndCreateOptimalPath(side, samples, nativeOrders, input, opts, fees, neonRouterNumSamples, vipSourcesSet, fillAdjustor);
    if (!paths) {
        sendMetrics();
        return undefined;
    }
    const { allSourcesPath, vipSourcesPath } = paths;
    if (!allSourcesPath || (vipSourcesPath === null || vipSourcesPath === void 0 ? void 0 : vipSourcesPath.isAdjustedBetterThan(allSourcesPath))) {
        sendMetrics();
        return vipSourcesPath;
    }
    sendMetrics();
    return allSourcesPath;
}
exports.findOptimalPathFromSamples = findOptimalPathFromSamples;
//# sourceMappingURL=path_optimizer.js.map