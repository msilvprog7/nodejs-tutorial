/// <reference path ="../../../../node_modules/bingmaps/scripts/MicrosoftMaps/Microsoft.Maps.d.ts" />

import $ = require('jquery');

import {Map} from "../shared/map";
import {Copy, Show} from "../shared/ui";
import {Id, User} from "../../../shared/user";



/**
 * Routes
 */
let protocol = "http",
    hostname = "localhost",
    port = 80,
    getUrl = (route?: string) => `${protocol}://${hostname}${port !== 80 ? (':' + port) : ''}${route ? route : ''}`,
    routes = {
        user: {
            create: '/user',
            get: '/user/',
            put: '/user/'
        }
    };

/**
 * Durations between to update share/view
 */
let shareUpdate = (1 / 30),
    viewUpdate = (1 / 30);

/**
 * Copy share link to clipboard and show message
 */
$('#share').click(() => {
    Copy.ToClipboard('#shareUrl', () => {
        Show.ForSeconds('#shareMessage', 3);
    });
});

/**
 * Start sharing the specified user's map
 * @userId Id of the user
 * @bingMap Bing Maps
 */
export function Share(userId: Id, bingMap: Microsoft.Maps.Map) {
    let map = new Map(bingMap, { id: userId });
    map.share(getUrl(routes.user.put), shareUpdate);
}

/**
 * Start viewing the specified user
 * @userId Id of the user
 * @bingMap Bing Maps
 */
export function View(userId: Id, bingMap: Microsoft.Maps.Map) {
    let map = new Map(bingMap, { id: userId });
    map.view(getUrl(routes.user.put), shareUpdate);
}
