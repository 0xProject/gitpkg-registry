import { BigNumber } from '@0x/utils';
import { SDK } from '@bancor/sdk';
import { BancorQuoteData } from './types';
export declare class BancorService {
    ethereumNodeEndpoint: string;
    minReturnAmountBufferPercentage: number;
    private _sdk?;
    constructor(ethereumNodeEndpoint: string);
    getSDKAsync(): Promise<SDK>;
    getQuoteAsync(fromToken: string, toToken: string, amount: BigNumber): Promise<BancorQuoteData>;
}
//# sourceMappingURL=bancor_service.d.ts.map