export async function RateMAL(rateData, sendResponse) {
  let result = await browser.storage.session.get("mal_access_token");
  const MAL_ACCESS_TOKEN = result.mal_access_token;

  const url = `https://api.myanimelist.net/v2/anime/${rateData?.metaData?.data?.Media?.idMal}/my_list_status`;

  const headers = {
    Authorization: `Bearer ${MAL_ACCESS_TOKEN}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const is_rewatching = false; // currently no option to set it to true; may
  const data = {
    status: `${rateData.status}`,
    is_rewatching: Number(is_rewatching),
    num_watched_episodes: rateData?.episode,
    score: rateData?.ratingNum,
  };

  let response = await fetch(url, {
    method: "PATCH",
    headers,

    body: new URLSearchParams(data).toString(),
  });
  response = await response.json();
  sendResponse(response);
}
