import { BigNumber } from '@0x/utils';
export interface ConfigsByChain {
    zeroExGovernor: {
        owners: string[];
        secondsTimeLocked: BigNumber;
        required: BigNumber;
    };
    staking: {
        epochDurationInSeconds: BigNumber;
        rewardDelegatedStakeWeight: number;
        minimumPoolStake: BigNumber;
        cobbDouglasAlphaNumerator: number;
        cobbDouglasAlphaDenominator: number;
    };
}
/**
 * Gets configs that correspond to the given chainId.
 * @param chainId Id of the netowrk.
 */
export declare function getConfigsByChainId(chainId: number): ConfigsByChain;
//# sourceMappingURL=configs_by_chain.d.ts.map