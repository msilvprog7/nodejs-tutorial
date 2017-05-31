import express = require('express');
import bodyParser = require('body-parser');

import {LatLon} from "./location";


let app: express.Application = express();
app.set('port', (process.argv.length > 2 && !isNaN(parseInt(process.argv[2])))
                    ? Number(process.argv[2])
                    : 80);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.post('/', (req: express.Request, res: express.Response) => {
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
});



app.listen(app.get('port'), () => {
    console.log(`Server running at http://localhost:${app.get('port')}/`);
});
