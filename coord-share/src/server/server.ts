import express = require('express');
import bodyParser = require('body-parser');
import shortId = require('shortid');
import nunjucks = require('nunjucks');
import path = require('path');
import fs = require('fs');

import {MapView, UserMapViews} from "../shared/location";
import {Id, ShareLink, User} from "../shared/user";
import {Config} from "../shared/config";
import {Utility} from "../shared/utility";



/**
 * Express Application and settings
 */
let app: express.Application = express();
app.set('port', (process.argv.length > 2 && !isNaN(parseInt(process.argv[2])))
                    ? Number(process.argv[2])
                    : 80);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

nunjucks.configure(['site'], {
    autoescape: true,
    express: app
});

/**
 * Route and static file settings
 */
let protocol = "http",
    hostname = "localhost",
    getUrl = (route?: string) => `${protocol}://${hostname}${app.get('port') !== 80 ? (':' + app.get('port')) : ''}${route ? route : ''}`,
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
    viewsDir = path.join(__dirname, '../../site'),
    views = {
        index: 'index.html',
        view: 'view.html'
    },
    config: Config = JSON.parse(fs.readFileSync(path.join(viewsDir, 'config.json'), 'utf8')),
    staticFiles = fs.readdirSync(viewsDir).filter(file => path.extname(file) === ".js");

/**
 * UserData: Id => MapView
 */
let userData: UserMapViews = {};



/**
 * Website to share location
 */
app.get(routes.index, (req, res) => {
    Utility.Log(`GET ${routes.index}`);

    let user = User.Create(),
        shareLink = ShareLink.Create(getUrl(routes.view), user);
    res.render(views.index, { user: user, share: shareLink, config: config });
});

/**
 * Website to view location
 */
app.get(`${routes.view}:id`, (req, res) => {
    Utility.Log(`GET ${routes.view}${req.params.id}`);

    let user: User = {
        id: req.params.id
    };
    
    res.render(views.view, { user: user, config: config });
});

/**
 * Serve static files from the views dir (e.g. js files)
 */
app.get(`${routes.static}:file`, (req, res) => {
    Utility.Log(`GET ${routes.static}${req.params.file}`);

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
    Utility.Log('GET ${routes.user.create}');

    res.status(200).send(JSON.stringify(User.Create()));
});

/**
 * Get the map view for the user
 */
app.get(`${routes.user.get}:id`, (req, res) => {
    Utility.Log(`GET ${routes.user.get}${req.params.id}`);

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
    Utility.Log(`PUT ${routes.user.put}${req.params.id}`);
    let mapView = MapView.TransformRequestToMapView(req.body);

    if (mapView !== null) {
        userData[req.params.id] = req.body;
        res.status(200).send();
    } else {
        res.status(405).send();
    }
});



/**
 * Listen on the port
 */
app.listen(app.get('port'), () => {
    Utility.Log(`Server running at ${getUrl()}`);
});
