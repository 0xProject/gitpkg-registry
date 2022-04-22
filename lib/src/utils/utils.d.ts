import { ChainId } from '@0x/contract-addresses';
export declare function valueByChainId<T>(rest: Partial<{
    [key in ChainId]: T;
}>, defaultValue: T): {
    [key in ChainId]: T;
};
//# sourceMappingURL=utils.d.ts.map