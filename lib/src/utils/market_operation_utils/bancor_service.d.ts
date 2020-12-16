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
    sdk: SDK;
    minReturnAmountBufferPercentage: number;
    static createAsync(provider: SupportedProvider): Promise<BancorService>;
    constructor(sdk: SDK);
    getQuotesAsync(fromToken: string, toToken: string, amounts: BigNumber[]): Promise<Array<Quote<BancorFillData>>>;
    getBancorNetworkAddress(): string;
}
//# sourceMappingURL=bancor_service.d.ts.map