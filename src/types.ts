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

export interface GenericLogger {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
