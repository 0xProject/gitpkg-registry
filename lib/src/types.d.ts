export interface HttpServiceConfig {
    httpPort: number;
    healthcheckHttpPort: number;
    healthcheckPath: string;
    httpKeepAliveTimeout: number;
    httpHeadersTimeout: number;
    enablePrometheusMetrics: boolean;
    prometheusPort: number;
    prometheusPath: string;
}
//# sourceMappingURL=types.d.ts.map