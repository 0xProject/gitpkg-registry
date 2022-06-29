import { BigNumber } from '@0x/utils';
import { MarketOperation } from '../../types';
import { Fill, FillAdjustor } from './types';
export declare class IdentityFillAdjustor implements FillAdjustor {
    adjustFills(side: MarketOperation, fills: Fill[], amount: BigNumber): Fill[];
}
//# sourceMappingURL=identity_fill_adjustor.d.ts.map