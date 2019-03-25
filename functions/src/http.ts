import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Express
import * as express from 'express';
import * as cors from 'cors';
import * as rp from "request-promise";


admin.initializeApp();

//GITHUB Setup
//import {environment} from '../environments/environment';
//const githubConfig = environment.githubConfig;
//const client_id = githubConfig.client_id;
//const client_secret = githubConfig.client_secret;
const apiBaseURL: string = "https://api.github.com";


//Interfaces
interface GithubUser {
  email: string,
  photoURL?: string,
  accessToken: string,
  loginName: string,
  name?: string,
  uid: string,
  url?: string,
  bio?: string,
  languages?:GithubLanguage[],
  repoCount?: number;
  repoTotal?: number;
  loading?: boolean
}

interface GithubLanguage {
  language?: string,
  show?: boolean,
  score?: number,
}

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

app.get('/user/:uid/:accesstoken', (request, response) => {
  const uid = request.params.uid;
  const docRef = admin.firestore().collection('github').doc(uid)
    var options = {
        uri: apiBaseURL + '/user',
        qs: {
            access_token: request.params.accesstoken // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
    //Make api call
    rp(options)
    .then(githubData => {
      const githubUser: GithubUser = {
        loginName: githubData.login,
        email: githubData.email,
        accessToken: request.params.accesstoken,
        uid: uid,
        url: githubData.html_url,
        bio: githubData.bio,
        photoURL: githubData.avatar_url,
        loading:true
      };
      docRef.set(githubUser)
      .then(res => {response.send(res)})
      .catch(err => {response.status(404).send(err)});
      
    })
    .catch(err => {
        // API call failed...
        response.status(404).send(err);
    });
    
});

app.get('/dog', (request, response) => {
  response.send('DOG');
});

export const api = functions.https.onRequest(app);