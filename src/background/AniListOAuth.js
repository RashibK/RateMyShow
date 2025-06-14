export const ANILIST_CLIENT_ID = "27628";
export const ANILIST_REDIRECT_URI = browser.identity.getRedirectURL();

export async function AniListAuth() {
  const redirectURL = await startAniListAuth();
  console.log(redirectURL);
  return parseRedirectURL(redirectURL);
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
    anilist_access_token: "anilist_access_token",
  });
  return anilist_access_token;
}

export async function getAniListUserData(sendResponse) {
  const anilist_access_token = await browser.storage.local.get({
    anilist_access_token: "anilist_access_token",
  });

  // if (anilist_access_token?.anilist_access_token)
  // {

  // }

    sendResponse({ message: "no_anilist_user_data" });
}
