"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artifacts = void 0;
const ApproximateBuys = require("../test/generated-artifacts/ApproximateBuys.json");
const BalanceChecker = require("../test/generated-artifacts/BalanceChecker.json");
const BalancerSampler = require("../test/generated-artifacts/BalancerSampler.json");
const BalancerV2BatchSampler = require("../test/generated-artifacts/BalancerV2BatchSampler.json");
const BalancerV2Common = require("../test/generated-artifacts/BalancerV2Common.json");
const BalancerV2Sampler = require("../test/generated-artifacts/BalancerV2Sampler.json");
const BancorSampler = require("../test/generated-artifacts/BancorSampler.json");
const CompoundSampler = require("../test/generated-artifacts/CompoundSampler.json");
const CurveSampler = require("../test/generated-artifacts/CurveSampler.json");
const DODOSampler = require("../test/generated-artifacts/DODOSampler.json");
const DODOV2Sampler = require("../test/generated-artifacts/DODOV2Sampler.json");
const ERC20BridgeSampler = require("../test/generated-artifacts/ERC20BridgeSampler.json");
const FakeTaker = require("../test/generated-artifacts/FakeTaker.json");
const GMXSampler = require("../test/generated-artifacts/GMXSampler.json");
const IBalancer = require("../test/generated-artifacts/IBalancer.json");
const IBalancerV2Vault = require("../test/generated-artifacts/IBalancerV2Vault.json");
const IBancor = require("../test/generated-artifacts/IBancor.json");
const ICurve = require("../test/generated-artifacts/ICurve.json");
const IGMX = require("../test/generated-artifacts/IGMX.json");
const IKyberNetwork = require("../test/generated-artifacts/IKyberNetwork.json");
const IMooniswap = require("../test/generated-artifacts/IMooniswap.json");
const IMStable = require("../test/generated-artifacts/IMStable.json");
const IMultiBridge = require("../test/generated-artifacts/IMultiBridge.json");
const IPlatypus = require("../test/generated-artifacts/IPlatypus.json");
const IShell = require("../test/generated-artifacts/IShell.json");
const ISmoothy = require("../test/generated-artifacts/ISmoothy.json");
const IUniswapExchangeQuotes = require("../test/generated-artifacts/IUniswapExchangeQuotes.json");
const IUniswapV2Router01 = require("../test/generated-artifacts/IUniswapV2Router01.json");
const KyberDmmSampler = require("../test/generated-artifacts/KyberDmmSampler.json");
const KyberSampler = require("../test/generated-artifacts/KyberSampler.json");
const LidoSampler = require("../test/generated-artifacts/LidoSampler.json");
const LiquidityProviderSampler = require("../test/generated-artifacts/LiquidityProviderSampler.json");
const MakerPSMSampler = require("../test/generated-artifacts/MakerPSMSampler.json");
const MooniswapSampler = require("../test/generated-artifacts/MooniswapSampler.json");
const MStableSampler = require("../test/generated-artifacts/MStableSampler.json");
const NativeOrderSampler = require("../test/generated-artifacts/NativeOrderSampler.json");
const PlatypusSampler = require("../test/generated-artifacts/PlatypusSampler.json");
const SamplerUtils = require("../test/generated-artifacts/SamplerUtils.json");
const ShellSampler = require("../test/generated-artifacts/ShellSampler.json");
const SmoothySampler = require("../test/generated-artifacts/SmoothySampler.json");
const TestNativeOrderSampler = require("../test/generated-artifacts/TestNativeOrderSampler.json");
const TwoHopSampler = require("../test/generated-artifacts/TwoHopSampler.json");
const UniswapSampler = require("../test/generated-artifacts/UniswapSampler.json");
const UniswapV2Sampler = require("../test/generated-artifacts/UniswapV2Sampler.json");
const UniswapV3Sampler = require("../test/generated-artifacts/UniswapV3Sampler.json");
const UtilitySampler = require("../test/generated-artifacts/UtilitySampler.json");
exports.artifacts = {
    ApproximateBuys: ApproximateBuys,
    BalanceChecker: BalanceChecker,
    BalancerSampler: BalancerSampler,
    BalancerV2BatchSampler: BalancerV2BatchSampler,
    BalancerV2Common: BalancerV2Common,
    BalancerV2Sampler: BalancerV2Sampler,
    BancorSampler: BancorSampler,
    CompoundSampler: CompoundSampler,
    CurveSampler: CurveSampler,
    DODOSampler: DODOSampler,
    DODOV2Sampler: DODOV2Sampler,
    ERC20BridgeSampler: ERC20BridgeSampler,
    FakeTaker: FakeTaker,
    GMXSampler: GMXSampler,
    KyberDmmSampler: KyberDmmSampler,
    KyberSampler: KyberSampler,
    LidoSampler: LidoSampler,
    LiquidityProviderSampler: LiquidityProviderSampler,
    MStableSampler: MStableSampler,
    MakerPSMSampler: MakerPSMSampler,
    MooniswapSampler: MooniswapSampler,
    NativeOrderSampler: NativeOrderSampler,
    PlatypusSampler: PlatypusSampler,
    SamplerUtils: SamplerUtils,
    ShellSampler: ShellSampler,
    SmoothySampler: SmoothySampler,
    TwoHopSampler: TwoHopSampler,
    UniswapSampler: UniswapSampler,
    UniswapV2Sampler: UniswapV2Sampler,
    UniswapV3Sampler: UniswapV3Sampler,
    UtilitySampler: UtilitySampler,
    IBalancer: IBalancer,
    IBalancerV2Vault: IBalancerV2Vault,
    IBancor: IBancor,
    ICurve: ICurve,
    IGMX: IGMX,
    IKyberNetwork: IKyberNetwork,
    IMStable: IMStable,
    IMooniswap: IMooniswap,
    IMultiBridge: IMultiBridge,
    IPlatypus: IPlatypus,
    IShell: IShell,
    ISmoothy: ISmoothy,
    IUniswapExchangeQuotes: IUniswapExchangeQuotes,
    IUniswapV2Router01: IUniswapV2Router01,
    TestNativeOrderSampler: TestNativeOrderSampler,
};
//# sourceMappingURL=artifacts.js.map