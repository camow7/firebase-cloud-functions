import * as functions from 'firebase-functions';

// Express
import * as express from 'express';
import * as cors from 'cors';


//GITHUB Setup
//import {environment} from '../environments/environment';
//const githubConfig = environment.githubConfig;
//const client_id = githubConfig.client_id;
//const client_secret = githubConfig.client_secret;
//const apiBaseURL: string = "https://api.github.com";
//var rp = require('request-promise');

// Most basic HTTP Funtion
export const basicHTTP = functions.https.onRequest((request, response) => {
  const name = request.query.name;

  if (!name) {
    response.status(400).send('ERROR you must supply a name :(');
  }

  response.send(`hello ${name}`)
});

// Custom Middleware
/*const auth = (request, response, next) => {
  if (!request.header.authorization) {
    response.status(400).send('unauthorized');
  }

  next();
};*/

// Multi Route ExpressJS HTTP Function
const app = express();
app.use(cors({ origin: true }));
//app.use(auth);

app.get('/user/:accesstoken', (request, response) => {
    /*var options = {
        uri: apiBaseURL + '/user/repos',
        qs: {
            access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };*/
    //Make api call

    response.send(request.params);
});

app.get('/dog', (request, response) => {
  response.send('DOG');
});

export const api = functions.https.onRequest(app);