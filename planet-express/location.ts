// An interface for Lat/Lon locations
export interface LatLon {
    lat: number,
    lon: number
}

// This is something I like to do where
// the interface and class are merged to expose
// static methods to be used with the interface
export class LatLon {
    // This is a type-guard, if the expression
    // holds true, latLon will be considered
    // the type LatLon from then on
    static isLatLon(latLon: any): latLon is LatLon {
        return (latLon && 
                typeof(latLon) === "object" &&
                typeof(latLon.lat) === "number" && 
                typeof(latLon.lon) === "number");
    }
}
