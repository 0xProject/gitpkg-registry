import { BigNumber } from '@0x/utils';
import { SignedNativeOrder } from '../types';
import { Chain } from './chain';
import { Address } from './types';
export declare class NativeOrderUtils {
    readonly chain: Chain;
    readonly exchangeProxyAddress: Address;
    private readonly _nativeOrderUtilsContractHelper;
    private readonly _nativeOrderUtilsContract;
    constructor(chain: Chain);
    getLimitOrderFillableTakerAmountsAsync(orders: SignedNativeOrder[], batchId?: number): Promise<BigNumber[]>;
    getLimitOrderFillableMakerAmountsAsync(orders: SignedNativeOrder[], batchId?: number): Promise<BigNumber[]>;
}
//# sourceMappingURL=native_order_utils.d.ts.map