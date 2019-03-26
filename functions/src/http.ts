import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Express
import * as express from 'express';
import * as cors from 'cors';
//import * as rp from "request-promise";
import * as github from "./github";


admin.initializeApp();

//GITHUB Setup
//import {environment} from '../environments/environment';
//const githubConfig = environment.githubConfig;
//const client_id = githubConfig.client_id;
//const client_secret = githubConfig.client_secret;
//const apiBaseURL: string = "https://api.github.com";


//Interfaces

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

app.get('/user/:uid/:accesstoken', async (request, response) => {
  const uid = request.params.uid;
  const docRef = admin.firestore().collection('github').doc(uid)
  try {
    const githubUser = await github.getUser(request.params.accesstoken,request.params.uid)
    docRef.set(githubUser)
      .then(res => {response.send(res)})
      .catch(err => {response.status(404).send(err)});  
    const githubRepos = 
  }
  catch (err){
    response.status(404).send(err)
  }

});

app.get('/dog', (request, response) => {
  github.getUser("accesstoekn","userID");
  response.send('DOG');
});

export const api = functions.https.onRequest(app);