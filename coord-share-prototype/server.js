var express = require('express'),
    bodyParser = require('body-parser'),
    nunjucks = require('nunjucks'),
    shortId = require('shortid'),
    path = require('path'),
    fs = require('fs');



/**
 * Express Application and settings
 */
var app = express();
app.set('port', (process.argv.length > 2 && !isNaN(parseInt(process.argv[2])))
                    ? Number(process.argv[2])
                    : 80);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Route and static file settings
 */
var protocol = "http",
    hostname = "localhost",
    getUrl = (route) => `${protocol}://${hostname}${app.get('port') !== 80 ? (':' + app.get('port')) : ''}${route ? route : ''}`,
    routes = {
        index: '/',
        view: '/view/',
        static: '/site/',
        user: {
            create: '/user',
            get: '/user/',
            put: '/user/'
        }
    },
    viewsDir = path.join(__dirname, 'site'),
    views = {
        index: 'index.html',
        view: 'view.html'
    },
    config = JSON.parse(fs.readFileSync(path.join(viewsDir, 'config.json'), 'utf8')),
    staticFiles = fs.readdirSync(viewsDir).filter(file => path.extname(file) === ".js");

nunjucks.configure(['site'], {
    autoescape: true,
    express: app
});

/**
 * User data and related functions
 */
var userData = {},
    createUser = function () { 
        return { id: shortId.generate() };
    },
    createShareLink = function(path, user) {
        return { url: `${path}${user}` };
    };

/**
 * Log to console with timestamp
 */
var log = (msg) => console.log(`${new Date().toLocaleString()}\t${msg}`);


/**
 * Website to share location
 */
app.get(routes.index, (req, res) => {
    log(`GET ${routes.index}`);

    var user = createUser();
        shareLink = createShareLink(getUrl(routes.view), user.id);
    res.render(views.index, { user: user, share: shareLink, config: config });
});

/**
 * Website to view location
 */
app.get(`${routes.view}:id`, (req, res) => {
    log(`GET ${routes.view}${req.params.id}`);

    var user = { id: req.params.id };
    
    res.render(views.view, { user: user, config: config });
});

/**
 * Serve static files from the views dir (e.g. js files)
 */
app.get(`${routes.static}:file`, (req, res) => {
    log(`GET ${routes.static}${req.params.file}`);

    if (staticFiles.indexOf(req.params.file) !== -1) {
        res.sendFile(path.join(viewsDir, req.params.file));
    } else {
        res.status(404).send();
    }
});

/**
 * Generate a new user
 */
app.get(routes.user.create, (req, res) => {
    log('GET ${routes.user.create}');

    res.status(200).send(JSON.stringify(createUser()));
});

/**
 * Get the map view for the user
 */
app.get(`${routes.user.get}:id`, (req, res) => {
    log(`GET ${routes.user.get}${req.params.id}`);

    if (userData[req.params.id]) {
        res.status(200).send(JSON.stringify(userData[req.params.id]));
    } else {
        res.status(404).send();
    }
});

/**
 * Update map view for the user
 */
app.put(`${routes.user.put}:id`, (req, res) => {
    log(`PUT ${routes.user.put}${req.params.id}`);
    var mapView = null;
    
    if (typeof(req.body) === "object" &&
        typeof(req.body.location) === "object" &&
        typeof(req.body.location.latitude) === "string" && !isNaN(parseFloat(req.body.location.latitude)) &&
        typeof(req.body.location.longitude) === "string" && !isNaN(parseFloat(req.body.location.longitude)) &&
        (req.body.zoom === null || (typeof(req.body.zoom) === "string" && !isNaN(parseInt(req.body.zoom))))) {
        mapView = {
            location: {
                latitude: parseFloat(req.body.location.latitude),
                longitude: parseFloat(req.body.location.longitude)
            },
            zoom: (req.body.zoom !== null) ? parseInt(req.body.zoom) : null
        };
    }

    if (mapView !== null) {
        userData[req.params.id] = mapView;
        res.status(200).send();
    } else {
        res.status(405).send();
    }
});



/**
 * Listen on the port
 */
app.listen(app.get('port'), () => {
    log(`Server running at ${getUrl()}`);
});
