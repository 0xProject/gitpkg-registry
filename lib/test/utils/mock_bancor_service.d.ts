import { BigNumber } from '@0x/utils';
import { SDK } from '@bancor/sdk';
import { BancorService } from '../../src/utils/market_operation_utils/bancor_service';
import { BancorFillData, Quote } from '../../src/utils/market_operation_utils/types';
export interface Handlers {
    getQuotesAsync: (fromToken: string, toToken: string, amount: BigNumber[]) => Promise<Array<Quote<BancorFillData>>>;
}
export declare class MockBancorService extends BancorService {
    handlers: Partial<Handlers>;
    minReturnAmountBufferPercentage: number;
    static createMockAsync(handlers: Partial<Handlers>): Promise<MockBancorService>;
    constructor(sdk: SDK, handlers: Partial<Handlers>);
    getQuotesAsync(fromToken: string, toToken: string, amounts: BigNumber[]): Promise<Array<Quote<BancorFillData>>>;
}
//# sourceMappingURL=mock_bancor_service.d.ts.map