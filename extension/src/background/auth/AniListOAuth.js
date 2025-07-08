import { getUserDataFromAnyProviderResponse } from "../background";

export const ANILIST_CLIENT_ID = "27628";
export const ANILIST_REDIRECT_URI = browser.identity.getRedirectURL();

export async function AniListAuth(sendResponse) {
  const redirectURL = await startAniListAuth();
  console.log(redirectURL);
  await parseRedirectURL(redirectURL);
  await getAniListUserData(sendResponse);
}

export async function startAniListAuth() {
  const response_type = "token";
  let authURL = "https://anilist.co/api/v2/oauth/authorize";
  authURL += `?response_type=${response_type}`;
  authURL += `&client_id=${ANILIST_CLIENT_ID}`;

  return await browser.identity.launchWebAuthFlow({
    interactive: true,
    url: authURL,
  });
}

export async function parseRedirectURL(redirectURL) {
  const fragment = new URL(redirectURL).hash.substring(1);
  const params = new URLSearchParams(fragment);
  const anilist_access_token = params.get("access_token");

  await browser.storage.local.set({
    anilist_access_token: anilist_access_token,
  });
  return anilist_access_token;
}

export async function getAniListUserData(sendResponse) {
  const anilist_access_token = await browser.storage.local.get(
    "anilist_access_token"
  );
  console.log("is the function getting sent properly", sendResponse);
  // after logout; send that response, so new auth starts
  if (!anilist_access_token.anilist_access_token) {
    sendResponse({ message: "no_anilist_user_data" });
  } else {
    // either it's after browser restart, or start of new auth
    console.log(anilist_access_token);

    const url = "https://graphql.anilist.co";

    const query = `
      query {
      Viewer {
      id
      name
      avatar {
        medium
      }

    }
  }`;

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anilist_access_token.anilist_access_token}`,
      },
      body: JSON.stringify({ query }),
    });
    response = await response.json();

    const userData = await getUserDataFromAnyProviderResponse(
      "AniList",
      response
    );

    let data = {
      anime: { name: "AniList", userData: userData },
      movie: { name: null, userData: null },
      tvShow: { name: null, userData: null },
    };

    // user data schema : { username, image}

    await browser.storage.session.set({ connected_providers: data });
    console.log("new auth is over, I am sending the data over:", userData);
    if (sendResponse) {
      sendResponse(userData);
    }
  }
}
