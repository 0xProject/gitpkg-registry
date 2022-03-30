import { AbiEncoder } from '@0x/utils';
export declare enum MultiplexSubcall {
    Invalid = 0,
    Rfq = 1,
    Otc = 2,
    UniswapV2 = 3,
    UniswapV3 = 4,
    LiquidityProvider = 5,
    TransformERC20 = 6,
    BatchSell = 7,
    MultiHopSell = 8
}
export declare const multiplexTransformERC20Encoder: AbiEncoder.DataType;
export declare const multiplexRfqEncoder: AbiEncoder.DataType;
export declare const multiplexUniswapEncoder: AbiEncoder.DataType;
export declare const multiplexPlpEncoder: AbiEncoder.DataType;
export declare const multiplexBatchSellEncoder: AbiEncoder.DataType;
//# sourceMappingURL=multiplex_encoders.d.ts.map