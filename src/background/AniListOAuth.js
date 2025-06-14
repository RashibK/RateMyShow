export const ANILIST_CLIENT_ID = "27628";
export const ANILIST_REDIRECT_URI = browser.identity.getRedirectURL();

export async function AniListAuth() {
  const authURL = "https://anilist.co/api/v2/oauth/authorize";

  const data = new URLSearchParams();
  data.append("client_id", ANILIST_CLIENT_ID);
  data.append("redirect_uri", ANILIST_REDIRECT_URI);

  let response = await fetch(authURL, {
    method: "GET",
    body: data,
  });
  response = await response.json();
  print('Response from AniList Auth', response)
}
