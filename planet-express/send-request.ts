import request = require('request');
import fs = require('fs');

import {LatLon} from "./location";


interface SampleData {
    samples: any[]
}



let server = "http://localhost/",
    samples = "samples.json";


// Callback for our server requests
let callback: request.RequestCallback = (err: any, response: request.RequestResponse, body: any) => {
    if (err) {
        return console.error(err);
    } else if (response.statusCode !== 200) {
        return console.error(`${response.statusCode}: ${response.statusMessage}`);
    }

    console.log(`Input: ${JSON.stringify(body.input)}`);
    console.log(`Valid: ${JSON.stringify(body.valid)}`);
};


// Read samples from samples.json
fs.readFile(samples, 'utf8', function (err: NodeJS.ErrnoException, data: string) {
    let jsonData: SampleData = JSON.parse(data);

    // Request each sample data for lat/lon validation
    for (let sample of jsonData.samples) {
        let options: request.CoreOptions = {
            method: "POST",
            json: true,
            body: sample
        };
        
        request(server, options, callback);
    }
});
