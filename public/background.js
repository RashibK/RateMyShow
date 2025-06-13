import {
  createCodeVerifier,
  createStateToken,
} from "./background/oAuthUtils.js";

const malRefreshToken = await browser.storage.local.get("mal_refresh_token");

export const MAL_CLIENT_ID = "db72b0c4364bb89f8c4bc7991b734bee";
export const MAL_REDIRECT_URI = browser.identity.getRedirectURL();

// check for user_data
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "send_user_data") {
    if (message.provider == "MyAnimeList") {
      getMALUserData(sendResponse);
      return true;
    }
    if (message.provider == "all") {
      (async () => {
        const data = await getAllConnectedProviders();
        sendResponse(data);
      })();
      return true;
    }
  } else if (message.type === "start_auth") {
    if (message.provider == "MyAnimeList") {
      (async () => {
        const userData = await MALAuth();
        sendResponse(userData);
      })();
    }
  } else if (message.type === "logout") {
    if (message.provider === "MyAnimeList") {
      (async () => {
        browser.storage.local.remove("mal_refresh_token");
        let data = await browser.storage.session.get("connected_providers");
        data = data.connected_providers;
        console.log("data is from logout bg", data);
        if (data.anime.name === message.provider) {
          data.anime.name = null;
          data.anime.userData = null;
          await browser.storage.session.set({ connected_providers: data });
        }
        sendResponse({ message: "mal_tokens_deleted" });
      })();
    }
  } else if (message.type === "connected_provider") {
    if (message.action === "update_connected_provider") {
      updateConnectedProvider(message.provider);
    }
    async () => {};
  }

  return true;
});

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
  console.log("I am in validate thing");
  const params = new URL(redirectURL).searchParams;
  const code = params.get("code");
  const state = params.get("state");

  const mal_state_param = await browser.storage.local.get("mal_state_param");
  const malStateParam = mal_state_param.mal_state_param;

  if (malStateParam === state) {
    console.log("state code and previous code are same");
    return exchangeCodeForRefreshToken(code);
  }
}

async function exchangeCodeForRefreshToken(code) {
  const tokenURL = "https://myanimelist.net/v1/oauth2/token";

  let malCodeVerifier = await browser.storage.local.get("mal_code_verifier");
  malCodeVerifier = malCodeVerifier.mal_code_verifier;

  const formBody = new URLSearchParams();
  formBody.append("client_id", MAL_CLIENT_ID);
  formBody.append("grant_type", "authorization_code");
  formBody.append("code", code);
  formBody.append("code_verifier", malCodeVerifier);
  formBody.append("redirect_uri", MAL_REDIRECT_URI);

  let response = await fetch(tokenURL, {
    method: "POST",
    body: formBody,
  });

  response = await response.json();
  const mal_refresh_token = response.refresh_token;
  const mal_access_token = response.access_token;
  const mal_expires_in = response.expires_in;

  //store them
  console.log(mal_refresh_token);
  console.log(mal_access_token);
  console.log(mal_expires_in);
  browser.storage.local.set({ mal_refresh_token: mal_refresh_token });
  browser.storage.local.set({ mal_expires_in: mal_expires_in });
  await browser.storage.session.set({ mal_access_token: mal_access_token });

  return fetchUserData();
}

// fetching user_data
export async function fetchUserData() {
  // // get access_token from session storage
  let result = await browser.storage.session.get("mal_access_token");

  const malAccessToken = result.mal_access_token;

  // do a fetch call to get user's data
  let response = await fetch(
    "https://api.myanimelist.net/v2/users/@me?fields=anime_statistics",
    {
      headers: {
        Authorization: `Bearer ${malAccessToken}`,
      },
    }
  );

  const malUserInfo = await response.json();
  malUserInfo["provider"] = "MyAnimeList";

  let data = {
    anime: { name: "MyAnimeList", userData: malUserInfo },
    movie: { name: null, userData: null },
    tv_show: { name: null, userData: null },
  };

  console.log("data when logging in for the first time:", data);
  await browser.storage.session.set({ connected_providers: data });
  const lol = await browser.storage.session.get("connected_providers");
  console.log("data gotten from session during first login", lol);
  return malUserInfo;
}

async function refreshAccessToken() {
  const malRefreshToken = await browser.storage.local.get("mal_refresh_token");

  //make it form urlencoded type
  let bodyInfo = new URLSearchParams();
  bodyInfo.append("client_id", MAL_CLIENT_ID);
  bodyInfo.append("grant_type", "refresh_token");
  bodyInfo.append("refresh_token", malRefreshToken.mal_refresh_token);

  let response = await fetch("https://myanimelist.net/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyInfo,
  });
  response = await response.json();

  // updating the refreshToken and accessToken value
  const mal_refresh_token = response.refresh_token;
  const mal_access_token = response.access_token;
  const mal_expires_in = response.expires_in;

  browser.storage.local.set({ mal_refresh_token: mal_refresh_token });
  browser.storage.local.set({ mal_expires_in: mal_expires_in });
  browser.storage.session.set({ mal_access_token: mal_access_token });
}

// ---------------------------------------------------------------------------------------------------
async function getMALUserData(sendResponse) {
  const userData = await browser.storage.session.get("connected_providers");
  const malData = userData?.connected_providers?.anime;

  console.log("here is the user data that i get from bg: ", malData);

  if (malData && malData.userData != null) {
    sendResponse(malData.userData);
  } else {
    if (
      Object.keys(malRefreshToken).length > 0 &&
      malRefreshToken != undefined
    ) {
      const userData = await refreshAccessToken().then(fetchUserData);
      console.log(
        "This is the userData of when there was resfresh token, but had to get userData:",
        userData
      );
      updateConnectedProvider("MyAnimeList", userData);
      sendResponse(userData);
    } else {
      // meaning it's the first time user is logging in
      sendResponse({ message: "no_mal_user_data" });
    }
  }
}
// ---------------------------------------------------------------------------------Check Connected Providers --------------------------------------------------
async function getAllConnectedProviders() {
  let data = await browser.storage.session.get("connected_providers");
  console.log("session stored data", data);
  data = data.connected_providers || {
    anime: { name: null, userData: null },
    movie: { name: null, userData: null },
    tv_show: { name: null, userData: null },
  };

  return {
    anime: data.anime?.userData ? data.anime : null,
    movie: data.movie?.userData ? data.movie : null,
    tv_show: data.tv_show?.userData ? data.tv_show : null,
  };
}

async function updateConnectedProvider(provider, userData) {
  let data = await browser.storage.session.get("connected_providers");
  data = data.connected_providers || {
    anime: { name: null, userData: null },
    movie: { name: null, userData: null },
    tv_show: { name: null, userData: null },
  };

  let category = null;

  //check which provider called this function; anime; movie or tv shows
  if (provider === "MyAnimeList" || provider === "AniList") {
    category = "anime";
  } else if (provider === "trakt") {
    category = "tv_show";
  }

  data[category].name = provider;
  data[category].userData = userData;

  await browser.storage.session.set({ connected_providers: data });
}
