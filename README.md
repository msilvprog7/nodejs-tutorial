Node.js from Prototype to Production
====================================

#### Michael Snider, May 31st, 2017



Introduction
------------------------------------
I'm a Software Engineer at Microsoft working on Bing's Location Graph
team. Recently, I've used Node.js to prototype new features and complete
ad-hoc tasks at work. Once you get the hang of node, it makes prototyping a breeze. 

I wrote this tutorial as part of a technical discussion series my manager
started, so the use of Microsoft APIs was used to accomodate
my team's familiarity. At times, these APIs could be replaced
with other company's APIs or even OpenSource APIs. Although TypeScript is 
a Microsoft language, I felt the use of it was not work-oriented as strongly-typed JavaScript
is great for collaboration and production-level code.

I'd like to thank my manager, Siddhartha Arora, for giving me the 
opportunity to make this tutorial, present it to our team, and publish it on Github.
Also, I'd like to give a huge thanks to my colleagues Senthil Palanisamy and Jason Wu
for reviewing the tutorial and providing me with feedback.



What You'll Learn About and Get Experience Using
------------------------------------
* Node.js
* NPM
* Express
* TypeScript
* How to Prototype with the above



About (adapted from [Node.js website](https://nodejs.org/en/))
------------------------------------

[Node.js](https://nodejs.org/en/), sometimes referred to as **NodeJS** or more commonly **node**, is built on Chrome's OpenSource v8 JavaScript engine and focuses on:
* Asynchronous events
* Non-blocking I/O
* Scalability

[NPM](https://www.npmjs.com/) is the ***Node Package Manager*** that comes bundled with Node.js. 



Setup
------------------------------------

* Install latest LTS version of [Node.js](https://nodejs.org/en/)
* Add Node.js to `PATH`:
    * Something like, `SET PATH=%PATH%;C:\Program Files\nodejs` or via **My Computer** > **Properties (Right Click)** > **Advanced System Settings** > **Environment Variables...**
    * `node --version` should return something like `v6.10.2`
    * `npm --version` should return something like `3.10.10`



> **Optional:**

> * Try one of the Warm ups below to limber up!
> * Try a tutorial, like **learnyounode**
>     * `npm install -g learnyounode`
>     * `learnyounode`



Warm up
------------------------------------

### 1. hello-server
Let's start by doing the [beginner's sample](https://nodejs.org/en/about/) http server in node... but I modified it to make it a bit more advanced to speed things up for you guys.

#### Code
So start by creating a ***directory*** `hello-server` with a new file in it called `hello-server.js`:

```
var http = require('http');
```

The `require(module: string)` function is a node-specific way to include a **module**. In this case, `http` is a module included with node, sometimes packages included are referred to as part of **node core**. This module will let us create an http server.

```
var hostname = '127.0.0.1',
    port = (process.argv.length > 2 && !isNaN(parseInt(process.argv[2])))
                ? Number(process.argv[2])
                : 80;
```

"Hey, is that a **command line argument** and some regular JavaScript for validating the number?" 
Yup, Node.js exposes the current process' information in a ***global*** called [process](https://nodejs.org/api/process.html#process_process_env). 
`process.argv` holds the command line arguments, `process.env` holds the user's environment settings (useful for machine configurations in Azure).

```
var server = http.createServer((req, res) => {
    // Debug incoming requests
    console.log(`${req.method} ${req.url}`);

    // Send response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Hello, world!' }));
});
```

Aside from the fancy arrow function expression syntax, we can create a server with just a function that takes in the `request` and the `response`. The details may not be obvious, but with some TypeScript declarations (which I'll show in another example), many editors can give you detailed type information.

```
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
```

Oh yeah, don't forget to listen to your server.

#### Running the Code
Ok, run it from the command line with `node hello-server.js`, you'll get your logged message. 
Open up your web browser of choice and just go to `http://localhost/` and you should get a response.

"Wait, what about all that fancy port stuff?" Feel free to run it on another port: `node hello-server 8080`, but ***port 80*** is the standard for HTTP according to the [Internet Assigned Numbers Authority (IANA)](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.txt).

Well you've done it. You made a server, now let's make a useful one with some convenient modules from ***npm***.


### 2. planet-express
At this point you should be feeling pretty confident, ready to show off your node skills at the next hackathon, so let's ruin that for a second... Let's learn how to use the popular npm package **express** AND learn **TypeScript** at the same time!

#### Info
[Express](http://expressjs.com/)? It's a **web framework** for node that abstracts away all the nuances of the ***http*** module by making a server application easily create routes, handle requests/responses, and serve content quickly.

[TypeScript](http://www.typescriptlang.org/)? This is a Microsoft-developed language that offers typing and transpilation to specific target versions of [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). "Woah woah woah, now there's another ***foo*** **Script** to remember?" Well in the history of Web languages, ECMAScript was formed to standardize JavaScript. So from the top: TypeScript is a superset of JavaScript and JavaScript is a superset of ECMAScript. TypeScript allows for your ***typeified*** code to be transpiled down to a specific standard so you can target specific JavaScript runtimes. For instance, Chrome and Firefox have separate implementations for JavaScript to run in; different runtimes tend to vary across the ECMAScript-standard-spectrum. [Anders Hejlsberg](https://en.wikipedia.org/wiki/Anders_Hejlsberg) (creator of C# and TypeScript) calls this issue the **feature gap**, where specific ECMAScript standards cannot be guaranteed across browsers and runtimes, and he offers TypeScript as its solution through its ability to transpile.

Ok, enough chit-chat. Let's code.

#### Code
First, create a new directory called `planet-express` and in it, run `npm init`. This is how a **node package** is initialized and a `package.json` is created. We're going to create a simple web-server that responds with whether or not a lat/lon is valid, hence the `planet` in the title.

Run the next commands: 
```
npm install -g typescript
npm install --save @types/node
npm install --save express
npm install --save @types/express
npm install --save body-parser
npm install --save @types/body-parser
npm install --save request
npm install --save @types/request
```

`-g` installs a package for the user, while `--save` instructs **npm** to save the node module in the current project, installing it in `./node_modules` and adding it as a dependency in `package.json`. This makes it so a fresh install of your codebase can be done simply by calling `npm install` to generate `./node_modules`.

A core principle of TypeScript is adhering to strong type definitions. Previously, the open source community created a collection of TS declaration files called [DefinitelyTyped](http://definitelytyped.org/). As this became commonly used, [TypeScript 2 introduced npm integration](https://blogs.msdn.microsoft.com/typescript/2016/06/15/the-future-of-declaration-files/) so that the open source community could share these definitions in their projects simply by installing `@types/<package-name>`. You can search for node packages with type declarations by using a site called [TypeSearch](http://microsoft.github.io/TypeSearch/).

Now create a TypeScript configuration file called `tsconfig.json`, fill it with:
```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5"
    },
    "files": [
        "server.ts",
        "location.ts",
        "send-request.ts"
    ]
}
```

**target** is the version of ECMAScript we'll transpile to, **module** is the JavaScript module implementation the output will be in. Next, we'll create each of these files. Don't fret, there are syntaxes to generalize where to pick up files from and even build tools that let you use a version of TypeScript from the npm dependencies (installed with `--save`).

Let's start off easy with `location.ts`:
```
export interface LatLon {
    lat: number,
    lon: number
}

export class LatLon {
    static isLatLon(latLon: any): latLon is LatLon {
        return (latLon && 
                typeof(latLon) === "object" &&
                typeof(latLon.lat) === "number" && 
                typeof(latLon.lon) === "number");
    }
}
```

This is a module that provides:
1. An ***interface*** for **LatLon** locations
2. A merged definition for **LatLon** to expose static helper methods
3. A static helper **type-guard** for validating an object is a **LatLon** (after calling this, the scope when true will regard ***latLon*** as a **LatLon**)

Now, let's create the server in `server.ts`

Start by importing ***express, body-parser, and our location module***
```
import express = require('express');
import bodyParser = require('body-parser');

import {LatLon} from "./location";
```

Then, we'll create an `Application` in express using type-declarations:
```
let app: express.Application = express();
app.set('port', (process.argv.length > 2 && !isNaN(parseInt(process.argv[2])))
                    ? Number(process.argv[2])
                    : 80);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
```

"Hey, we re-used something from the previous warm-up!" It's the least I could do.

Anyways, this is how you create an Application in express. In the app, we've made a [setting](http://expressjs.com/en/api.html#app.set) keyed 'port' that we can reference later as the port to run our server on. We've also 
[mounted middleware](http://expressjs.com/en/api.html#app.use) by declaring that we'll use **body-parser** to parse **JSON** for POST bodies our server retrieves (see [bodyParser.json(options)](https://github.com/expressjs/body-parser#bodyparserjsonoptions)) and populates our Application's ***requests*** with key-value pairs that may contain ***any*** type (see [bodyParser.urlencoded(options)](https://github.com/expressjs/body-parser#bodyparserurlencodedoptions)).

Now let's create a route for this API we're creating:
```
app.post('/', (req: express.Request, res: express.Response) => {
    
    // ...

});
```

When a ***POST*** request is sent to **http://localhost:port/**, our function will now get called. This can even be extended to pass in variables to be [REST-ful](https://en.wikipedia.org/wiki/Representational_state_transfer).

Let's populate the function:
```
let result = {
    input: req.body,
    valid: false
}

if (req && req.body && LatLon.isLatLon(req.body)) {
    result.valid = (req.body.lat >= -90 &&
                    req.body.lat <= 90 && 
                    req.body.lon >= -180 && 
                    req.body.lon <= 180);
}

let resultStr = JSON.stringify(result);
console.log(resultStr);
res.status(200).send(resultStr);
```

Seems simple enough. Validate the **LatLon** numbers. If you are using an editor like VSCode, you can even hover over **req.body** in the if-statement and you'll see the body is now regarded as type **LatLon** thanks to our type-guard.

```
app.listen(app.get('port'), () => {
    console.log(`Server running at http://localhost:${app.get('port')}/`);
});
```

Don't forget to listen.

#### Testing
"Testing this could get tricky..." Nah, let's test it by creating some sample data. Create `samples.json`:
```
{
    "samples": [
        { "lat": -90, "lon": -180 },
        { "lat": -90.1, "lon": -180 },
        { "lat": -90, "lon": -180.1 },
        { "lat": 0, "lon": 0 },
        { "lat": 90, "lon": 180 },
        { "lat": 90.1, "lon": 180 },
        { "lat": 90, "lon": 180.1 },
        { "lat": -90.1, "lon": -180.1 },
        { "lat": 0 },
        { "lon": 0 },
        { "lat": 0, "lon": 0, "message": "hey" },
        {}
    ]
}
```

And then create `send-request.ts`:
```
import request = require('request');
import fs = require('fs');
import {LatLon} from "./location";

interface SampleData {
    samples: any[]
}

let server = "http://localhost/",
    samples = "samples.json";
```

We'll import a new module called `request` that lets us send web requests easily and `fs` to access the file system. Notice my use of `let` for variables. I don't want to get off on a tangent, but if you're curious, checkout [let vs. var](http://stackoverflow.com/questions/762011/whats-the-difference-between-using-let-and-var-to-declare-a-variable).

To read files asynchronously, we'll call `fs.readFile(file: string, encoding: string, callback: (err: NodeJS.ErrnoException, data: string) => void)`:
```
fs.readFile(samples, 'utf8', function (err: NodeJS.ErrnoException, data: string) {
    let jsonData: SampleData = JSON.parse(data);

    // ...
});
```

Now we can use the file content as a SampleData type. A type-guard would have been better here, but whatever. Inside the callback, add:

```
for (let sample of jsonData.samples) {
    let options: request.CoreOptions = {
        method: "POST",
        json: true,
        body: sample
    };
    
    request(server, options, callback);
}
```

That looks super smooth for essentially a single-threaded DOS-attack in the making. But we're missing our callback, the crux of our monitoring story! Back near `server` and `samples`, create a typed callback as such:
```
let callback: request.RequestCallback = (err: any, response: request.RequestResponse, body: any) => {
    if (err) {
        return console.error(err);
    } else if (response.statusCode !== 200) {
        return console.error(`${response.statusCode}: ${response.statusMessage}`);
    }

    console.log(`Input: ${JSON.stringify(body.input)}`);
    console.log(`Valid: ${JSON.stringify(body.valid)}`);
};
```

#### Running the Code
There we have it, now we can see if our samples are indeed **LatLons**! Compile it with `tsc` (since we installed it globally with npm), open two terminals: one for our server and one for our client.

Server:
`node server.js [port]`

Client:
`node send-request.js` (you will need to tweak the code if you want to test on a different port)

No surprise errors hopefully, but what you should see is a set of results. Look through them and see if they're what you expected. Play around and add some test cases if you'd like. One in particular I think is interesting is the following test case:
```
Input: {"lat":0,"lon":0,"message":"hey"}
Valid: true
```

By definition it is a **LatLon**, it is an ***object*** with ***number*** fields ***lat*** and ***lon*** and can act as such, even with the additional ***message*** field.

Pat yourself on the back, you've earned it because you've just built a web-server in TypeScript. If you think this is trivial, it's not. I made a lot of cursory Internet searches to steal as much as I could, but so many were half-baked and incomplete. So hopefully your confidence has been restored!


Let's Make a Prototype
------------------------------------
So let's code together a simple location sharing website. The site will be called ***coord-share*** (I thought of a bunch of puns on social media websites, but LatLonChat didn't sound that great).

The site will have the following requirements:
* A user can use a Bing Map to change their latitude, longitude, and zoom
* A user can share these properties from the Bing Map with other users via custom URL
* A viewer will be able to observe the sharer's view of the Bing Map

There's 2 core pieces of code we'll need:
1. RESTful endpoints for updating and receiving changes to the map view
2. Serving two website pages for sharing and viewing the map

As a prototype, we want to do this as quick as possible with code that's simple enough that we can throw it away or change it if need be. That's why we'll just use plain JavaScript for now. However, in the section **Prototype to Production**, I'll explain how we can adapt what we have to be more ***production-ready***. 

#### RESTful endpoints
So let's start from with a new node project in a directory called `coord-share-prototype`:
```
npm init
...
npm install --save express
npm install --save body-parser
npm install --save nunjucks
npm install --save shortid
```

Let's start with the basics of our Express server in `server.js` with our module imports, setting up the app, and listening on a port:
```
var express = require('express'),
    bodyParser = require('body-parser'),
    nunjucks = require('nunjucks'),
    shortId = require('shortid'),
    path = require('path'),
    fs = require('fs');

var app = express();
app.set('port', (process.argv.length > 2 && !isNaN(parseInt(process.argv[2])))
                    ? Number(process.argv[2])
                    : 80);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Log to console with timestamp
 */
var log = (msg) => console.log(`${new Date().toLocaleString()}\t${msg}`);

/**
 * Helper to get the route to the server
 */
var getUrl = (route) => {
    return `http://localhost${app.get('port') !== 80 ? (':' + app.get('port')) : ''}${route ? route : ''}`;
};



// Routes will go here
// ...



app.listen(app.get('port'), () => {
    log(`Server running at ${getUrl()}`);
});
```

First, let's setup a route for retrieving a user's data. Let's say if I make a GET request to `/user/r1YrhnueZ`, I expect to get the MapView for user with Id `r1YrhnueZ`, else 404.

With Express' route syntax, we can define url parameters with `:var_name` and we can access it via `req.params.var_name`. Let's add this route:
```
// Mapping from Id => MapView 
var userData = {};

/**
 * Get the map view for the user
 */
app.get(`/user/:id`, (req, res) => {
    log(`GET /user/${req.params.id}`);

    if (userData[req.params.id]) {
        res.status(200).send(JSON.stringify(userData[req.params.id]));
    } else {
        res.status(404).send();
    }
});
```

Similarly, if we make a PUT request to `/user/r1YrhnueZ`, I expect to put the MapView for user with Id `r1YrhnueZ`, else 405. For now, let's skip the 405 method not allowed checking and assume we'll always get a request body with `location.latitude`, `location.longitude`, and `zoom`:
```
/**
 * Update map view for the user
 */
app.put(`/user/:id`, (req, res) => {
    log(`PUT /user/${req.params.id}`);

    var mapView = {
        location: {
            latitude: parseFloat(req.body.location.latitude),
            longitude: parseFloat(req.body.location.longitude)
        },
        zoom: (req.body.zoom !== null) ? parseInt(req.body.zoom) : null
    };
    
    userData[req.params.id] = mapView;
    res.status(200).send();
});
```

Sweet, we now have a RESTful API for interacting with our server-side data. Let's start setting up the site.

#### Website
For simplicity, we'll use a templating language called [nunjucks](https://mozilla.github.io/nunjucks/) that works well with node. If you've used Django's templating language or one based on it called [Jinja2](http://jinja.pocoo.org/), these templating languages make it easy to serve templates from a server with data.

So let's start with a new directory `site` with `base.html`:
```
<html lang="en">
    <head>
        <title>coord-share - location sharing made simple</title>

        <!-- CSS Resources -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/united/bootstrap.min.css" integrity="sha384-pVJelSCJ58Og1XDc2E95RVYHZDPb9AVyXsI8NoVpB2xmtxoZKJePbMfE4mlXw7BJ" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body>
        <!-- Nav bar -->
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapsaleNavBar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">coord-share</a>
                </div>

                <div class="collapse navbar-collapse" id="collapsaleNavBar">
                    <ul class="nav navbar-nav">
                        <!-- Nothing currently -->
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <!-- Nothing currently -->
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Main site map control -->
        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-md-8">
                    <h2>coord-share <i class="fa fa-globe" aria-hidden="true"></i></h2>
                    {% block main %}{% endblock %}
                </div>
                <div class="col-xs-6 col-md-4">
                    {% block side %}{% endblock %}
                </div>
            </div>
        </div>


        <!-- JS Resources -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        {% block extrajs %}{% endblock %}
    </body>
</html>
```

I've included CSS and JS resources for [Bootstrap](http://getbootstrap.com/), [Font Awesome](http://fontawesome.io/), and [JQuery](https://jquery.com/) to help... bootstrap... a quick website.

You'll notice there are **blocks** `main`, `side`, and `extrajs` which our webpages will be able to extend with content.

Let's make `index.html` based on this template:
```
{% extends "base.html" %}

{% block main %}
    <div id="map" style="height: 450px;"></div>
{% endblock %}

{% block side %}
    <h2>Controls</h2>
    <div class="form-group">
        <label class="control-label" for="user">User</label>
        <input class="form-control" type="text" readonly id="user" value="{{ user.id }}" />
    </div>
    <div class="form-group">
        <label class="control-label" for="share">Share</label>
        <button class="form-control btn btn-info" id="share">Get a Link</button>
        <br /><br />
        <div style="text-align: center; display: none;" id="shareMessage">Copied to Clipboard!</div>
    </div>
    <input class="form-control" style="display: none;" type="text" readonly id="shareUrl" value="{{ share.url }}" readonly />
{% endblock %}

{% block extrajs %}
    <script src="/site/client.js" type='text/javascript'></script>
    <script src='http://www.bing.com/api/maps/mapcontrol?branch=release&callback=loadMap' type='text/javascript' async defer></script>
    <script type="text/javascript">
        var loadMap = function () {
            // Map async callback
            // ...
        };
    </script>
{% endblock %}
```

Not to get too ahead of myself, but I've used the `main` block for the map, the `side` block for controls, and `extrajs` to include our own JS, the Bing Maps API, and custom JS that the Bing Maps API will call after it has loaded.

Throughout, you'll see `{{ stuff }}`, this will be populated with data from the server when the template is rendered for the user's request. To account for these, let's switch back to `server.js` for a moment to add routes to render this index page when a user hits the `/` endpoint and an addition view page when a user hits the `/view/:id` endpoint:
```
var viewsDir = path.join(__dirname, 'site'),
    config = JSON.parse(fs.readFileSync(path.join(viewsDir, 'config.json'), 'utf8')),
    staticFiles = fs.readdirSync(viewsDir).filter(file => path.extname(file) === ".js");

// Configure app with nunjucks to serve templates from views directory 'site'
nunjucks.configure(['site'], {
    autoescape: true,
    express: app
});

/**
 * Website to share location
 */
app.get('/', (req, res) => {
    log(`GET /`);

    var user = { id: shortId.generate() },
        shareLink = { url: `${getUrl('/view')}/${user.id}` };
    res.render('index.html', { user: user, share: shareLink, config: config });
});

/**
 * Website to view location
 */
app.get(`/view/:id`, (req, res) => {
    log(`GET /view/${req.params.id}`);

    var user = { id: req.params.id };
    
    res.render('view.html', { user: user, config: config });
});

/**
 * Serve static files from the views dir (e.g. js files)
 */
app.get(`/site/:file`, (req, res) => {
    log(`GET /site/${req.params.file}`);

    if (staticFiles.indexOf(req.params.file) !== -1) {
        res.sendFile(path.join(viewsDir, req.params.file));
    } else {
        res.status(404).send();
    }
});
```

We'll also serve js files from the `site` directory so that our templates can share logic.

You'll notice I'm also passing down `config.json` for both index and view requests, create `config.json` in the `site` directory as well:
```
{
    "keys": {
        "BingMapsApi": ""
    },
    "defaultMapView": {
        "location": {
            "latitude": 47.614871,
            "longitude": -122.194032
        },
        "zoom": 17
    }
}
```

We can pass down the Bing Maps API Key and some default Map View the site can use. Sign in at [Bing Maps Portal](https://www.bingmapsportal.com/) to obtain a free API Key.

So back to the `index.html`, let's use the configuration to use the route data and configuration passed down:
```
var loadMap = function () {
    var map = new Microsoft.Maps.Map(document.getElementById("map"), {
        credentials: "{{ config.keys.BingMapsApi }}",
        navigationBarMode: Microsoft.Maps.NavigationBarMode.compact
    });

    map.setView({
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        center: new Microsoft.Maps.Location(parseFloat("{{ config.defaultMapView.location.latitude }}"), parseFloat("{{ config.defaultMapView.location.longitude }}")),
        zoom: parseInt("{{ config.defaultMapView.zoom }}")
    });
    
    // We'll add this shortly in client.js
    share("{{ user.id }}", map);
};
```

So, next let's make it so we can share this map view by hitting our endpoint using JQuery. In `client.js`, add:
```
var port = 80,
    getUrl = (route) => `http://localhost${port !== 80 ? (':' + port) : ''}${route ? route : ''}`;

// Seconds
var shareUpdate = (1 / 30);

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
        url: `${getUrl('/user')}/${userId}`,
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
```

If you're not familiar with JQuery, this may look intimidating, but it's not too different from `planet-express` where we sent requests to our endpoint. In this case, we call `share()` again and again, throttling it with a 30th of a second timeout.

Let's also add code to copy the share url to the clipboard when the user clicks a button. You've probably seen it on any slick webpage today, but since we passed down the share url and populated it in a hidden input, all we need to do is quickly show it, copy it, hide it, and display a message:
```
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
```

From what I've read online, most JS runtimes now support `document.execCommand("copy")` as most web developers find this convenient to aid the user.

Now we just need to create a view page. Make `view.html`:
```
{% extends "base.html" %}

{% block main %}
    <div id="map" style="height: 450px;"></div>
{% endblock %}

{% block side %}
    <h2>Observing</h2>
    <div class="form-group">
        <label class="control-label" for="user">User</label>
        <input class="form-control" type="text" readonly id="user" value="{{ user.id }}" />
    </div>
{% endblock %}

{% block extrajs %}
    <script src="/site/client.js" type='text/javascript'></script>
    <script src='http://www.bing.com/api/maps/mapcontrol?branch=release&callback=loadMap' type='text/javascript' async defer></script>
    <script type="text/javascript">
        var loadMap = function () {
            var map = new Microsoft.Maps.Map(document.getElementById("map"), {
                credentials: "{{ config.keys.BingMapsApi }}",
                navigationBarMode: Microsoft.Maps.NavigationBarMode.compact
            });

            map.setView({
                mapTypeId: Microsoft.Maps.MapTypeId.road,
                center: new Microsoft.Maps.Location(parseFloat("{{ config.defaultMapView.location.latitude }}"), parseFloat("{{ config.defaultMapView.location.longitude }}")),
                zoom: parseInt("{{ config.defaultMapView.zoom }}")
            });

            map.setOptions({
                disablePanning: true,
                disableZooming: true
            });

            // We'll add this shortly to client.js
            view("{{ user.id }}", map);
        };
    </script>
{% endblock %}
```

It's almost completely identical to the index, except it just shows the user id being viewed in the `side` block and calls `view(userId, map)`.

So let's add the logic to view in `client.js`:
```
// Seconds
var viewUpdate = (1 / 30);

/**
 * Start viewing the specified user
 * @userId Id of the user
 * @bingMap Bing Maps
 */
var view = function (userId, bingMap) {
    $.ajax({
        method: 'GET',
        url: `${getUrl('/user')}/${userId}`,
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
```

The only difference here, is that we parse the JSON retrieved from our endpoint and set the expected values on our map view using the Bing Maps API.

But, now let's try it out.

#### Running the Code

`node server.js [port]`

In a web browser: `http://localhost/` or `http://localhost:port/` (with changes to `client.js`)

Click the 'Get a Link' button, paste into another browser tab. Move the map around, you should see the map view change accordingly.


From Prototype to Production
------------------------------------
Our prototype was pretty straight forward. We had data stored locally on the server, our Express application served the data using a simple RESTful API, and our site interacted with the API to use the Bing Maps as a canvas for our data. Changes could be made fairly quickly, server-side and client-side, but what would be difficult about releasing this into the unknown in Production?

Some thoughts:
* Real data storage
    * The prototype stored everything locally
* Testing
    * The prototype had none
* Building code
    * Sure we could run the server and edit files in `/site`, but a well-defined build process could make this better
* Developing with other people
    * This is difficult with free-styled objects in JavaScript, there are ways to do this but they aren't as simple as other languages

If you look in `coord-share`, I at least tried to address the last two concerns.
1. Building code
    * I used [Gulp](http://gulpjs.com/) to build the TypeScript and organized it in a `src` directory. The node `package.json` will build and start the server. This could simplify Continuous Integration and Deployment.
2. Developing with other people
    * I wrote this version in TypeScript with `shared` types between client and server

For testing, there are many test framework tools used, including Mocha.js, QUnit, and [many more](http://stackoverflow.com/questions/300855/javascript-unit-test-tools-for-tdd)

For real data storage, you could use a number of different stores depending on your requirements (latency, consistency, throughput, etc.). One example is [mongodb](https://github.com/christkv/node-mongodb-native).
