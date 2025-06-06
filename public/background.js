import { createCodeVerifier, createStateToken } from "./background/oAuthUtils.js";

const malRefreshToken = await browser.storage.local.get('mal_refresh_token');

export const MAL_CLIENT_ID = "db72b0c4364bb89f8c4bc7991b734bee";
export const MAL_REDIRECT_URI = browser.identity.getRedirectURL();

// check for user_data 
browser.runtime.onMessage.addListener((message, sender, sendResponse ) => {
    if (message.type === 'send_user_data') {
        (async () => {
            const userData = await browser.storage.session.get('userInfo');
            console.log('here is the user data that i get from bg: ', userData)
            if (userData.userInfo && Object.keys(userData.userInfo).length > 0) {
    
                sendResponse(userData.userInfo)
            }else {
                if (Object.keys(malRefreshToken).length > 0) {
                    const userData = await refreshAccessToken().then(fetchUserData);
                    console.log('This is the userData of when there was resfresh token, but had to get userData:', userData)
                    sendResponse(userData);
    
                } else { // meaning it's the first time user is logging in
                    sendResponse({'message': 'no_user_data'})             
                } 
            }
            
        })();   
    }else if (message.type === 'start_mal_auth') {
        (async () => {
            const userData = await MALAuth();
            sendResponse(userData);
        })();
    } else if (message.type === 'logout') {
        browser.storage.session.remove('userInfo');
        browser.storage.local.remove('mal_refresh_token');
        
        sendResponse({'message': 'tokens_deleted'})
    }

    return true;
})

//---------------------------------------MyAnimeList Whole Auth Flow-------------------------------------------------------------------

function MALAuth() {
    return startMALAuth().then(validate);
  }

function startMALAuth() {

    const response_type = "code";
    let authURL = "https://myanimelist.net/v1/oauth2/authorize";
    authURL += `?response_type=${response_type}`;
    authURL += `&client_id=${MAL_CLIENT_ID}`;
    authURL += `&state=${createStateToken()}`;
    authURL += `&redirect_uri=${MAL_REDIRECT_URI}`;
    authURL += `&code_challenge=${createCodeVerifier()}`;
    authURL += `&code_challenge_method=plain`;

    return browser.identity.launchWebAuthFlow({
      interactive: true,
      url: authURL,
    });

  }

async function validate(redirectURL) {
    console.log('I am in validate thing')
    const params = new URL(redirectURL).searchParams;
    const code = params.get("code");
    const state = params.get("state");

    const mal_state_param = await browser.storage.local.get('mal_state_param');
    const malStateParam = mal_state_param.mal_state_param

    if (malStateParam === state) {
        console.log('state code and previous code are same')
        return exchangeCodeForRefreshToken(code)
    } 
 }

async function exchangeCodeForRefreshToken(code) {

    const tokenURL = "https://myanimelist.net/v1/oauth2/token";
    
    let malCodeVerifier = await browser.storage.local.get('mal_code_verifier');
    malCodeVerifier = malCodeVerifier.mal_code_verifier

    const formBody = new URLSearchParams();
    formBody.append('client_id', MAL_CLIENT_ID);
    formBody.append('grant_type', 'authorization_code');
    formBody.append('code', code);
    formBody.append('code_verifier', malCodeVerifier);
    formBody.append('redirect_uri', MAL_REDIRECT_URI);
  
    let response = await fetch( tokenURL, {
      method: "POST",
      body: formBody, 
    });
  
    response = await response.json();
    const mal_refresh_token = response.refresh_token;
    const mal_access_token = response.access_token;
    const mal_expires_in = response.expires_in;
  
    //store them
    console.log(mal_refresh_token)
    console.log(mal_access_token);
    console.log(mal_expires_in);
    browser.storage.local.set({mal_refresh_token: mal_refresh_token});
    browser.storage.local.set({mal_expires_in: mal_expires_in})
    await browser.storage.session.set({mal_access_token: mal_access_token});
    
    return fetchUserData();
  
  }

// fetching user_data
export async function fetchUserData() {

    // // get access_token from session storage
    let result = await browser.storage.session.get('mal_access_token');

    const malAccessToken = result.mal_access_token;

    // do a fetch call to get user's data
    let response = await fetch('https://api.myanimelist.net/v2/users/@me?fields=anime_statistics', {
        headers: {
            'Authorization': `Bearer ${malAccessToken}`
        }
    });

    const userInfo = await response.json();
    
    // keep the user info in session storage
    browser.storage.session.set({userInfo: userInfo});
    return userInfo;

}

async function refreshAccessToken() {

    const malRefreshToken = await browser.storage.local.get('mal_refresh_token');

    //make it form urlencoded type
    let bodyInfo = new URLSearchParams();
    bodyInfo.append('client_id', MAL_CLIENT_ID);
    bodyInfo.append('grant_type', 'refresh_token');
    bodyInfo.append('refresh_token', malRefreshToken.mal_refresh_token);
    
    let response = await fetch('https://myanimelist.net/v1/oauth2/token', {
        method: "POST",
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyInfo
    });
    response = await response.json();   
    
    // updating the refreshToken and accessToken value
    const mal_refresh_token = response.refresh_token;
    const mal_access_token = response.access_token;
    const mal_expires_in = response.expires_in;
    
    browser.storage.local.set({mal_refresh_token: mal_refresh_token});
    browser.storage.local.set({mal_expires_in: mal_expires_in})
    browser.storage.session.set({mal_access_token: mal_access_token});
    
  }
  
  