//File that contains all the logic for Githubg
const apiBaseURL: string = "https://api.github.com";
import * as rp from "request-promise";

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

  interface GithubRepo {
    primaryLanguage?: string,
    show?: boolean,
    owner?: boolean,
    name?: string,
    description?: string,
    url?: string,
    visible?: boolean
    contributors?: GithubContributors[],
    commits?: number,
    a?: number,
    c?: number,
    d?: number,
    w?: number,
    commitsArray?: object,
    datesArray?: object
  }

  interface GithubContributors {
    author: object,
    total: number,
    weeks: GithubContributorsWeeks[]
  }
  
  interface GithubContributorsWeeks {
    a: number,
    c: number,
    d: number,
    w: number,
  }

//Get infor about user
export async function getUser(accesstoken: string, uid: string): Promise<GithubUser> {
    var options = {
        uri: apiBaseURL + '/user',
        qs: {
            access_token: accesstoken // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
    //Make api call
    return rp(options)
    .then(githubData => {
      const githubUser: GithubUser = {
        loginName: githubData.login,
        email: githubData.email,
        accessToken: accesstoken,
        uid: uid,
        url: githubData.html_url,
        bio: githubData.bio,
        photoURL: githubData.avatar_url,
        loading:true
      };
      return Promise.resolve(githubUser);
      
    })
    .catch(err => {
        // API call failed...
        return Promise.reject(err);
    });
    
};

//Get info about the users repos
export async function getRepos(uid: string, accesstoken: string){
    var options = {
        uri: apiBaseURL + '/user/repos',
        qs: {
            access_token: accesstoken // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };

    return rp(options)
    .then(githubData => {
      const githubUser: GithubUser = {
        loginName: githubData.login,
        email: githubData.email,
        accessToken: accesstoken,
        uid: uid,
        url: githubData.html_url,
        bio: githubData.bio,
        photoURL: githubData.avatar_url,
        loading:true
      };
      return Promise.resolve(githubUser);
      
    })
    .catch(err => {
        // API call failed...
        return Promise.reject(err);
    });
}
