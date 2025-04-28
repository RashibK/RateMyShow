import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MAL_CLIENT_ID, MAL_REDIRECT_URI } from "./authConstants";
import { createCodeVerifier, createStateToken } from "../../utils/oauthHelpers";


// getting redirect url with code + state values
export const malOauth = createAsyncThunk('auth/malOauth', async () => {
    let authURL = "https://myanimelist.net/v1/oauth2/authorize";
    console.log('Hello 0')
    authURL += `?response_type=code`;
    authURL += `&client_id=${MAL_CLIENT_ID}`;
    authURL += `&state=${createStateToken()}`;
    authURL += `&redirect_uri=${MAL_REDIRECT_URI}`;
    authURL += `&code_challenge=${createCodeVerifier()}`;
    authURL += `&code_challenge_method=plain`;

    const returnURL = await browser.identity.launchWebAuthFlow({
        interactive: true,
        url: authURL,
        });

    // validate the returnURL
    const params = new URL(returnURL).searchParams;
    const code = params.get("code");
    const state = params.get("state");
    if (sessionStorage.getItem('mal_state_param') === state) {
        return code
    } 
})

// getting refresh + access token from code
export const exchangeCodeForRefreshToken = createAsyncThunk('auth/exchangeCodeForRefreshToken', async (code) => {
    console.log('inside exchaning token thing, yayyyy')
    const tokenURL = "https://myanimelist.net/v1/oauth2/token";

    const formBody = new URLSearchParams();
    formBody.append('client_id', MAL_CLIENT_ID);
    formBody.append('grant_type', 'authorization_code');
    formBody.append('code', code);
    formBody.append('code_verifier', sessionStorage.getItem('mal_code_verifier'));
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
    browser.storage.session.set({mal_access_token: mal_access_token});
    
})

//refresh both access + refresh tokens when the user closes the popup and click again
export const malRefreshAccessToken = createAsyncThunk('auth/malRefreshAccessToken', async () => {
    const malRefreshToken = await browser.storage.local.get('mal_refresh_token')
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
    
})

// Slice
const initialState = {
    logged_in: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(exchangeCodeForRefreshToken.fulfilled, (state) => {
            state.logged_in = true
        })

    }
})

export default authSlice.reducer;