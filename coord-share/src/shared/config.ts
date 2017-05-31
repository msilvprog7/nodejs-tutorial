import {MapView} from "./location";



/**
 * Type alias for an API Key
 */
export type ApiKey = string;

/**
 * Config interface
 */
export interface Config {
    keys: ConfigKeys,
    defaultMapView: MapView
};

/**
 * Static Config helpers 
 */
export class Config {
    /**
     * Config type-guard
     * @param config Potential Config
     */
    static IsConfig(config: any): config is Config {
        return config &&
               config.keys && ConfigKeys.IsConfigKeys(config.keys) &&
               config.defaultMapView && MapView.IsMapView(config.defaultMapView);
    }
}

/**
 * Configuration Keys needed
 */
export interface ConfigKeys {
    BingMapsApi: ApiKey
};

/**
 * Static ConfigKeys helpers 
 */
export class ConfigKeys {
    /**
     * ConfigKeys type-guard
     * @param configKeys Potential Config Keys
     */
    static IsConfigKeys(configKeys: any): configKeys is ConfigKeys {
        return configKeys &&
               configKeys.BingMapsApi && typeof(configKeys.BingMapsApi) === "string";
    }
}
