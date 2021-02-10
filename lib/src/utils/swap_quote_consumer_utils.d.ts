import { ContractAddresses } from '@0x/contract-addresses';
import { BigNumber } from '@0x/utils';
import { SupportedProvider } from '@0x/web3-wrapper';
import { SwapQuoteExecutionOpts } from '../types';
export declare const swapQuoteConsumerUtils: {
    getTakerAddressOrThrowAsync(provider: SupportedProvider, opts: Partial<SwapQuoteExecutionOpts>): Promise<string>;
    getTakerAddressAsync(provider: SupportedProvider, opts: Partial<SwapQuoteExecutionOpts>): Promise<string | undefined>;
    getEthAndWethBalanceAsync(provider: SupportedProvider, contractAddresses: ContractAddresses, takerAddress: string): Promise<[BigNumber, BigNumber]>;
};
//# sourceMappingURL=swap_quote_consumer_utils.d.ts.map