"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const utils_1 = require("@0x/utils");
const ethers_1 = require("ethers");
// import { utils as ethers5Utils } from 'ethers5';
const _ = require("lodash");
const perf_hooks_1 = require("perf_hooks");
const percentile = require('percentile');
// tslint:disable-next-line: no-implicit-dependencies
const fast_abi_1 = require("fast-abi");
const constants_1 = require("../../src/utils/market_operation_utils/constants");
const sampler_1 = require("../../src/utils/market_operation_utils/sampler");
describe.only('Encoder perf', () => {
    const UNISWAP_V2_SELL_ABI = {
        inputs: [
            {
                internalType: 'address',
                name: 'router',
                type: 'address',
            },
            {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
            },
            {
                internalType: 'uint256[]',
                name: 'takerTokenAmounts',
                type: 'uint256[]',
            },
        ],
        name: 'sampleSellsFromUniswapV2',
        outputs: [
            {
                internalType: 'uint256[]',
                name: 'makerTokenAmounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    };
    const KYBER_TUPLE_ABI = {
        inputs: [
            {
                name: 'opts',
                type: 'tuple',
                components: [
                    {
                        name: 'reserveOffset',
                        type: 'uint256',
                    },
                    {
                        name: 'hintHandler',
                        type: 'address',
                    },
                    {
                        name: 'networkProxy',
                        type: 'address',
                    },
                    {
                        name: 'weth',
                        type: 'address',
                    },
                    {
                        name: 'hint',
                        type: 'bytes',
                    },
                ],
            },
            {
                name: 'takerToken',
                type: 'address',
            },
            {
                name: 'makerToken',
                type: 'address',
            },
            {
                name: 'takerTokenAmounts',
                type: 'uint256[]',
            },
        ],
        name: 'sampleSellsFromKyberNetwork',
        outputs: [
            {
                name: 'reserveId',
                type: 'bytes32',
            },
            {
                name: 'hint',
                type: 'bytes',
            },
            {
                name: 'makerTokenAmounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    };
    const BATCH_CALL_ABI = {
        inputs: [
            {
                name: 'callDatas',
                type: 'bytes[]',
            },
        ],
        name: 'batchCall',
        outputs: [
            {
                name: 'callResults',
                type: 'tuple[]',
                components: [
                    {
                        name: 'data',
                        type: 'bytes',
                    },
                    {
                        name: 'success',
                        type: 'bool',
                    },
                ],
            },
        ],
        stateMutability: 'view',
        type: 'function',
    };
    const RUST_ENCODER = new fast_abi_1.FastABI([UNISWAP_V2_SELL_ABI, BATCH_CALL_ABI, KYBER_TUPLE_ABI], { BigNumber: utils_1.BigNumber });
    // tslint:disable: custom-no-magic-numbers
    const RUNS = 10000;
    // const RUNS = 1;
    const ADDRESS_1 = '0x6b175474e89094c44da98b954eedeac495271d0f';
    const ADDRESS_2 = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    let summary;
    const perf = (fn) => {
        const wrapped = perf_hooks_1.performance.timerify(fn);
        const resultsMs = [];
        const obs = new perf_hooks_1.PerformanceObserver(list => resultsMs.push(list.getEntries()[0].duration));
        obs.observe({ entryTypes: ['function'] });
        _.times(RUNS, () => wrapped());
        obs.disconnect();
        summary = {
            p25: percentile(25, resultsMs),
            p50: percentile(50, resultsMs),
            p99: percentile(99, resultsMs),
            p100: percentile(100, resultsMs),
        };
    };
    before(() => {
        console.log('Runs:', RUNS);
    });
    beforeEach(() => {
        summary = { p25: '0', p50: '0', p99: '0', p100: '0' };
    });
    afterEach(() => {
        const { p25, p50, p99, p100 } = summary;
        console.log(`p25: ${p25}ms, p50: ${p50}ms, p99: ${p99}ms, p100: ${p100}ms\n`);
    });
    const TIMEOUT = 360000;
    const ZERO_EX_ENCODER = new utils_1.AbiEncoder.Method(UNISWAP_V2_SELL_ABI);
    const ZERO_EX_UNOPTIMIZED = { shouldOptimize: false, shouldAnnotate: false };
    const ZERO_EX_OPTIMIZED = { shouldOptimize: true, shouldAnnotate: false };
    const ETHERS_INTERFACE = new ethers_1.utils.Interface([UNISWAP_V2_SELL_ABI]);
    const ETHERS_ENCODER = ETHERS_INTERFACE.functions[UNISWAP_V2_SELL_ABI.name];
    // const ETHERS_5_INTERFACE = new ethers5Utils.Interface([UNISWAP_V2_SELL_ABI]);
    describe.only('hello', () => {
        // it('node', () => {
        //     const f = () => 'hello world';
        //     perf(f);
        // });
        // it.only('rust', () => {
        //     const f = () => FastABI.ping();
        //     perf(f);
        // });
        it.only('rust - encode', () => {
            const params = [ADDRESS_1, [ADDRESS_2], [1, 2, 3]];
            const output = RUST_ENCODER.encodeInput('sampleSellsFromUniswapV2', params);
            console.log(RUST_ENCODER.decodeInput('sampleSellsFromUniswapV2', output));
        });
    });
    describe.only('Tuple ABI', () => {
        const ZERO_EX_TUPLE = new utils_1.AbiEncoder.Method(KYBER_TUPLE_ABI);
        const params = [
            {
                reserveOffset: constants_1.ZERO_AMOUNT,
                hintHandler: utils_1.NULL_ADDRESS,
                networkProxy: utils_1.NULL_ADDRESS,
                weth: utils_1.NULL_ADDRESS,
                hint: '0x',
            },
            ADDRESS_1,
            ADDRESS_2,
            sampler_1.getSampleAmounts(new utils_1.BigNumber(100e6), 13, 1.03),
        ];
        const encoded = ZERO_EX_TUPLE.encode(params, ZERO_EX_UNOPTIMIZED);
        describe('encode', () => {
            it('rust', () => {
                const f = () => RUST_ENCODER.encodeInput('sampleSellsFromKyberNetwork', params);
                contracts_test_utils_1.expect(f()).to.eq(encoded);
                perf(f);
            });
            it('zeroex - optimized', () => {
                const f = () => ZERO_EX_TUPLE.encode(params, ZERO_EX_OPTIMIZED);
                perf(f);
            });
            it('zeroex - unoptimized', () => {
                const f = () => ZERO_EX_TUPLE.encode(params, ZERO_EX_UNOPTIMIZED);
                perf(f);
            });
        });
        describe('decode', () => {
            it('rust', () => {
                console.log(ZERO_EX_TUPLE.decode(encoded));
                const f = () => RUST_ENCODER.decodeInput('sampleSellsFromKyberNetwork', encoded);
                console.log(f());
            });
        });
    });
    describe('Uniswap ABI', () => {
        [13, 130].forEach(numSamples => {
            describe(`${numSamples} input encode`, () => {
                const params = [
                    ADDRESS_1,
                    [ADDRESS_1, ADDRESS_2, ADDRESS_1],
                    sampler_1.getSampleAmounts(new utils_1.BigNumber(100e6), numSamples, 1.03),
                ];
                it.only('ZeroEx - optimized', () => {
                    const f = () => ZERO_EX_ENCODER.encode(params, ZERO_EX_OPTIMIZED);
                    perf(f);
                }).timeout(TIMEOUT);
                it.only('ZeroEx - no optimize', () => {
                    const f = () => ZERO_EX_ENCODER.encode(params, ZERO_EX_UNOPTIMIZED);
                    perf(f);
                }).timeout(TIMEOUT);
                it('ZeroEx - BigInt - optimize', () => {
                    const amounts = params[2].map(n => BigInt(n.toString()));
                    const f = () => ZERO_EX_ENCODER.encode([params[0], params[1], amounts], ZERO_EX_OPTIMIZED);
                    perf(f);
                }).timeout(TIMEOUT);
                it('ZeroEx - BigInt - no optimize', () => {
                    const amounts = params[2].map(n => BigInt(n.toString()));
                    const f = () => ZERO_EX_ENCODER.encode([params[0], params[1], amounts], ZERO_EX_UNOPTIMIZED);
                    perf(f);
                }).timeout(TIMEOUT);
                it.only('rust', () => {
                    const f = () => RUST_ENCODER.encodeInput('sampleSellsFromUniswapV2', params);
                    perf(f);
                    contracts_test_utils_1.expect(f()).to.eq(ZERO_EX_ENCODER.encode(params, ZERO_EX_UNOPTIMIZED));
                }).timeout(TIMEOUT);
                it.skip('Ethers', () => {
                    const f = () => ETHERS_ENCODER.encode(params);
                    perf(f);
                });
                // it.skip('Ethers 5', () => {
                //     const f = () => ETHERS_5_INTERFACE.encodeFunctionData(UNISWAP_V2_SELL_ABI.name, params);
                //     perf(f);
                // }).timeout(TIMEOUT);
            });
            describe.only(`${numSamples} input decode`, () => {
                const params = [
                    ADDRESS_1,
                    [ADDRESS_1, ADDRESS_2, ADDRESS_1],
                    sampler_1.getSampleAmounts(new utils_1.BigNumber(100e6), numSamples, 1.03),
                ];
                const data = ZERO_EX_ENCODER.encode(params, ZERO_EX_UNOPTIMIZED);
                it('ZeroEx', () => {
                    const f = () => ZERO_EX_ENCODER.decode(data);
                    perf(f);
                }).timeout(TIMEOUT);
                it('rust', () => {
                    const f = () => RUST_ENCODER.decodeInput('sampleSellsFromUniswapV2', data);
                    perf(f);
                }).timeout(TIMEOUT);
            });
            describe.only(`${numSamples} output decode`, () => {
                const params = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e6), numSamples, 1.03);
                const data = ZERO_EX_ENCODER.encodeReturnValues([params], ZERO_EX_UNOPTIMIZED);
                it('ZeroEx', () => {
                    const f = () => ZERO_EX_ENCODER.decodeReturnValues(data);
                    perf(f);
                }).timeout(TIMEOUT);
                it('rust', () => {
                    const f = () => RUST_ENCODER.decodeOutput('sampleSellsFromUniswapV2', data);
                    perf(f);
                }).timeout(TIMEOUT);
            });
        });
    });
    describe('BatchCall ABI', () => {
        [10, 50, 100].forEach(numSamples => {
            describe.only(`${numSamples} batchCall`, () => {
                const callParams = [
                    ADDRESS_1,
                    [ADDRESS_1, ADDRESS_2, ADDRESS_1],
                    sampler_1.getSampleAmounts(new utils_1.BigNumber(100e6), 13, 1.03),
                ];
                const encodedBatchCall = ZERO_EX_ENCODER.encode(callParams, ZERO_EX_UNOPTIMIZED);
                const params = _.times(numSamples, () => encodedBatchCall);
                const BATCH_CALL_ENCODER = new utils_1.AbiEncoder.Method(BATCH_CALL_ABI);
                it('rust', () => {
                    const f = () => RUST_ENCODER.encodeInput('batchCall', [params]);
                    contracts_test_utils_1.expect(f()).to.eq(BATCH_CALL_ENCODER.encode([params], ZERO_EX_UNOPTIMIZED));
                    perf(f);
                }).timeout(TIMEOUT);
                it('ZeroEx - optimized', () => {
                    const f = () => BATCH_CALL_ENCODER.encode([params], ZERO_EX_OPTIMIZED);
                    perf(f);
                }).timeout(TIMEOUT);
                it('ZeroEx - no optimize', () => {
                    const f = () => BATCH_CALL_ENCODER.encode([params], ZERO_EX_UNOPTIMIZED);
                    perf(f);
                }).timeout(TIMEOUT);
            });
        });
    });
});
//# sourceMappingURL=encode_test.js.map