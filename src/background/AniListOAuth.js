export const ANILIST_CLIENT_ID = "27628";
export const ANILIST_REDIRECT_URI = browser.identity.getRedirectURL();

export async function AniListAuth() {
  const redirectURL = await startAniListAuth();
  return validate(redirectURL);
}

export async function startAniListAuth() {
  const response_type = "code";
  let authURL = "https://anilist.co/api/v2/oauth/authorize";
  authURL += `?response_type=${response_type}`;
  authURL += `&client_id=${ANILIST_CLIENT_ID}`;
  authURL += `&redirect_uri=${ANILIST_REDIRECT_URI}`;

  return await browser.identity.launchWebAuthFlow({
    interactive: true,
    url: authURL,
  });
}

export async function validate(redirectURL) {
  console.log("I am in validate thing");
  const params = new URL(redirectURL).searchParams;
  const code = params.get("code");

  return code;
}

export async function getAniListUserData(sendResponse) {
  sendResponse({ message: "no_anilist_user_data" });
}
