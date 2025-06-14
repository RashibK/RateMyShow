export const ANILIST_CLIENT_ID = "27628";
export const ANILIST_REDIRECT_URI = browser.identity.getRedirectURL();

export async function AniListAuth() {
  console.log("I am in start of AniList Auth");
  const response_type = "code";
  let authURL = "https://anilist.co/api/v2/oauth/authorize";
  authURL += `?response_type=${response_type}`;
  authURL += `&client_id=${ANILIST_CLIENT_ID}`;
  authURL += `&redirect_uri=${ANILIST_REDIRECT_URI}`;

  const response = await browser.identity.launchWebAuthFlow({
    interactive: true,
    url: authURL,
  });
  console.log(response)
}

export async function getAniListUserData(sendResponse) {
  sendResponse({ message: "no_anilist_user_data" });
}
