/**
 * Routes
 */
var protocol = "http",
    hostname = "localhost",
    port = 80,
    getUrl = (route) => `${protocol}://${hostname}${port !== 80 ? (':' + port) : ''}${route ? route : ''}`,
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
var shareUpdate = (1 / 30),
    viewUpdate = (1 / 30);

/**
 * Copy share link to clipboard and show message
 */
$('#share').click(() => {
    var shareUrl = "#shareUrl";

    $(shareUrl).show();
    $(shareUrl).select();
    document.execCommand("copy");
    $(shareUrl).hide();

    var shareMessage = "#shareMessage";
    $(shareMessage).show();
    setTimeout(() => $(shareMessage).hide(), 3000);
});

/**
 * Start sharing the specified user's map
 * @userId Id of the user
 * @bingMap Bing Maps
 */
var share = function (userId, bingMap) {
    var data = {
        location: {
            latitude: bingMap.getCenter().latitude,
            longitude: bingMap.getCenter().longitude
        },
        zoom: bingMap.getZoom()
    };

    $.ajax({
        method: 'PUT',
        url: `${getUrl(routes.user.put)}${userId}`,
        data: data,
        dataType: 'json',
        success: (data, textStatus, jqXhr) => {
            if (jqXhr && jqXhr.status !== 200) {
                console.error(`${jqXhr.status}: ${textStatus}`);
            }

            setTimeout(() => share(userId, bingMap), 1000 * shareUpdate);
        },
        error: (jqXhr, textStatus, errorThrown) => {
            console.error(`${jqXhr.status}: ${textStatus}`);
            setTimeout(() => share(userId, bingMap), 1000 * shareUpdate);
        }
    });
};

/**
 * Start viewing the specified user
 * @userId Id of the user
 * @bingMap Bing Maps
 */
var view = function (userId, bingMap) {
    $.ajax({
        method: 'GET',
        url: `${getUrl(routes.user.get)}${userId}`,
        success: (data, textStatus, jqXhr) => {
            if (jqXhr && jqXhr.status !== 200) {
                console.error(`${jqXhr.status}: ${textStatus}`);
            } else if (data) {
                var jsonData = JSON.parse(data);
                bingMap.setView({
                    center: new Microsoft.Maps.Location(parseFloat(jsonData.location.latitude), parseFloat(jsonData.location.longitude)),
                    zoom: (jsonData.zoom) ? parseInt(jsonData.zoom) : bingMap.getZoom()
                });
            }

            setTimeout(() => view(userId, bingMap), 1000 * viewUpdate);
        },
        error: (jqXhr, textStatus, errorThrown) => {
            console.error(`${jqXhr.status}: ${textStatus}`);
            setTimeout(() => view(userId, bingMap), 1000 * viewUpdate);
        }
    });
};
