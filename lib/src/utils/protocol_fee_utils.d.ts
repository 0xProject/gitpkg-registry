import { BigNumber } from '@0x/utils';
export declare class ProtocolFeeUtils {
    private static _instance;
    private readonly _ethGasStationUrl;
    private readonly _gasPriceHeart;
    private _gasPriceEstimation;
    private _errorCount;
    static getInstance(gasPricePollingIntervalInMs: number, ethGasStationUrl?: string, initialGasPrice?: BigNumber): ProtocolFeeUtils;
    getGasPriceEstimationOrThrowAsync(shouldHardRefresh?: boolean): Promise<BigNumber>;
    /**
     * Destroys any subscriptions or connections.
     */
    destroyAsync(): Promise<void>;
    private constructor();
    private _getGasPriceFromGasStationOrThrowAsync;
    private _initializeHeartBeat;
}
//# sourceMappingURL=protocol_fee_utils.d.ts.map