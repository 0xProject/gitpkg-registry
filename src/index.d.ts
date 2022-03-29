export interface OptimizerCapture {
  side: 'Sell' | 'Buy';
  targetInput: number; // Amount to sell/buy
  pathsIn: SerializedPath[]; // Input samples
  pathOut?: SerializedPath;
}

export interface SerializedPath {
  ids: string[]; // unique ID for each sample, used to reconstruct the result in TS.
  inputs: number[]; // sample inputs (taker amount for sells, maker amounts for buys)
  outputs: number[]; // sample outputs (maker amounts for buys, taker amounts for sells)
  outputFees: number[]; // fees denominated in output token
  isVip: boolean; // Is this source a gas optimized VIP integration
}

export declare function route(
  source: OptimizerCapture,
  allRoutesStrategy: Float64Array,
  allRoutesOutputAmounts: Float64Array,
  vipRoutesStrategy: Float64Array,
  vipRoutesOutputAmounts: Float64Array,
  numSamples?: number, // Number of samples after interpolation. Defaults to 200 if not provided
): undefined;
