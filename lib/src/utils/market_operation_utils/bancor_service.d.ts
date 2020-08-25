import { SupportedProvider } from '@0x/dev-utils';
import { BigNumber } from '@0x/utils';
import { SDK } from '@bancor/sdk';
import { BlockchainType, Token } from '@bancor/sdk/dist/types';
import { BancorFillData, Quote } from './types';
/**
 * Converts an address to a Bancor Token type
 */
export declare function token(address: string, blockchainType?: BlockchainType): Token;
export declare class BancorService {
    provider: SupportedProvider;
    minReturnAmountBufferPercentage: number;
    private _sdk?;
    constructor(provider: SupportedProvider);
    getSDKAsync(): Promise<SDK>;
    getQuoteAsync(fromToken: string, toToken: string, amount?: BigNumber): Promise<Quote<BancorFillData>>;
    getBancorNetworkAddressAsync(): Promise<string>;
}
//# sourceMappingURL=bancor_service.d.ts.map