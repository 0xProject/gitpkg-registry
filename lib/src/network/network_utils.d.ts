import { Chain } from './chain';
import { Address } from './types';
export declare class NetworkUtils {
    readonly chain: Chain;
    private readonly _networkUtilsContractHelper;
    private readonly _networkUtilsContract;
    constructor(chain: Chain);
    getTokenDecimalsAsync(tokens: Address[], batchId?: string): Promise<number[]>;
    isAddressContractAsync(address: Address, batchId?: string): Promise<boolean>;
}
//# sourceMappingURL=network_utils.d.ts.map