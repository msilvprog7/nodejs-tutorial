/**
 * Locations represented as Lat/Lon
 */
export interface Location {
    latitude: number,
    longitude: number
}

/**
 * Location static helpers
 */
export class Location {
    /**
     * Type-guard for Locations
     * @param location Potential Location
     */
    static IsLocation(location: any): location is Location {
        return (location && 
                typeof(location) === "object" &&
                typeof(location.latitude) === "number" && 
                typeof(location.longitude) === "number");
    }
}

/**
 * MapViews represented as Location and Zoom
 */
export interface MapView {
    location: Location,
    zoom: number | null
}

/**
 * MapView static helpers
 */
export class MapView {
    /**
     * Type-guard for MapViews
     * @param mapView Potential MapViews
     */
    static IsMapView(mapView: any): mapView is MapView {
        return (mapView && 
                typeof(mapView) === "object" &&
                typeof(mapView.location) === "object" &&
                Location.IsLocation(mapView.location) && 
                (mapView.zoom === null || typeof(mapView.zoom) === "number"));
    }

    /**
     * Transform a request's map view from
     * string fields to number fields
     */
    static TransformRequestToMapView(mapView: any): MapView | null {
        if (mapView && 
            typeof(mapView) === "object" &&
            typeof(mapView.location) === "object" &&
            typeof(mapView.location.latitude) === "string" && !isNaN(parseFloat(mapView.location.latitude)) &&
            typeof(mapView.location.longitude) === "string" && !isNaN(parseFloat(mapView.location.longitude)) &&
            (mapView.zoom === null || (typeof(mapView.zoom) === "string" && !isNaN(parseInt(mapView.zoom))))) {
                return {
                    location: {
                        latitude: parseFloat(mapView.location.latitude),
                        longitude: parseFloat(mapView.location.longitude)
                    },
                    zoom: (mapView.zoom === null) ? null : parseInt(mapView.zoom)
                };
        }

        return null;
    }
}

/**
 * UserMapViews represented as an indexable from Id to MapView
 */
export interface UserMapViews {
    [index: string]: MapView
}
