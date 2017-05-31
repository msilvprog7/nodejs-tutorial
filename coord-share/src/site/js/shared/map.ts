/// <reference path ="../../../../node_modules/bingmaps/scripts/MicrosoftMaps/Microsoft.Maps.d.ts" />

import {MapView} from "../../../shared/location";
import {Request} from "../shared/request";
import {User} from "../../../shared/user";



/**
 * Map class to wrap around Bing Maps Map instance
 * with useful functionality to the application
 */
export class Map {
    /**
     * Bing Map
     */
    private map: Microsoft.Maps.Map;

    /**
     * User that the map is locating
     */
    private user: User;

    /**
     * Whether the sharing service should be stopped
     */
    private stopSharing: boolean;

    /**
     * Whether the viewing service should be stopped
     */
    private stopViewing: boolean;

    /**
     * Construct a Map wrapper around a Bing Map
     */
    constructor(map: Microsoft.Maps.Map, user: User) {
        this.map = map;
        this.user = user;
    }

    /**
     * Get the current map view
     */
    private getMapView(): MapView {
        return {
            location: {
                latitude: this.map.getCenter().latitude,
                longitude: this.map.getCenter().longitude
            },
            zoom: this.map.getZoom()
        };
    }

    /**
     * Set the current map view
     * @param mapView Map View to set
     */
    private setMapView(mapView: MapView): void {
        this.map.setView({
            center: new Microsoft.Maps.Location(mapView.location.latitude, mapView.location.longitude),
            zoom: (mapView.zoom) ? mapView.zoom : this.map.getZoom()
        });
    }

    /**
     * Share the user's map view continuously
     * @param url Url to put data to
     * @param seconds Duration in between requests
     * @param request Optional request for sequential calls
     */
    share(url: string, seconds: number, request?: Request): void {
        if (!request) {
            request = new Request("PUT", `${url}${this.user.id}`);
            this.stopSharing = false;
        }

        request.send(this.getMapView(), (status: number, data: any) => {
            if (!this.stopSharing) {
                setTimeout(() => this.share(url, seconds, request), 1000 * seconds);
            }
        });
    }

    /**
     * 
     * @param url Url to get data from
     * @param seconds Duration in between requests
     * @param request Optional request for sequential calls
     */
    view(url: string, seconds: number, request?: Request): void {
        if (!request) {
            request = new Request("GET", `${url}${this.user.id}`);
            this.stopViewing = false;
        }

        request.send(null, (status: number, data: any) => {
            console.log(data);
            let mapView = MapView.TransformRequestToMapView(JSON.parse(data));
            if (mapView !== null) {
                this.setMapView(mapView);
            }

            if (!this.stopViewing) {
                setTimeout(() => this.view(url, seconds, request), 1000 * seconds);
            }
        });
    }
}
