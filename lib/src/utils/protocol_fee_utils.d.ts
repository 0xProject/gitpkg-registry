import { BigNumber } from '@0x/utils';
export declare class ProtocolFeeUtils {
    gasPriceEstimation: BigNumber;
    private readonly _gasPriceHeart;
    private readonly _ethGasStationUrl;
    constructor(gasPricePollingIntervalInMs: number, ethGasStationUrl?: string, initialGasPrice?: BigNumber);
    getGasPriceEstimationOrThrowAsync(shouldHardRefresh?: boolean): Promise<BigNumber>;
    /**
     * Destroys any subscriptions or connections.
     */
    destroyAsync(): Promise<void>;
    private _getGasPriceFromGasStationOrThrowAsync;
    private _initializeHeartBeat;
}
//# sourceMappingURL=protocol_fee_utils.d.ts.map