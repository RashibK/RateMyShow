import { data } from "autoprefixer";
import { getProviderIdsFromTitle } from "../../utils/animeUtils";

export async function MALSync(metaData) {
  try {
    const result = await getProviderIdsFromTitle(metaData);
    const malId = result?.data?.Media?.idMal;
    const anilistId = result?.data?.Media?.id;

    // if it's the last episode of the series/season; then -completed else - watching
    let status = null;
    if (result?.data?.Media?.episodes === metaData?.episode_number) {
      status = "completed";
    } else {
      status = "watching";
    }

    const isRewatching = false; // currently no option to log as rewatched

    const numOfWatchEpisodes = metaData?.episode_number;

    await syncTheMediaMAL(
      malId,
      status,
      Number(isRewatching),
      numOfWatchEpisodes,
      null
    );
  } catch (err) {
    console.log("Error in MALSync: ", err);
  }
}

async function syncTheMediaMAL(
  malId,
  status,
  isRewatching,
  numOfWatchEpisodes,
  score
) {
  try {
    // get MAL_ACCESS_TOKEN
    let result = await browser.storage.session.get("mal_access_token");
    const MAL_ACCESS_TOKEN = result.mal_access_token;

    if (!MAL_ACCESS_TOKEN) {
      browser.runtime.sendMessage;
    }

    const url = `https://api.myanimelist.net/v2/anime/${malId}/my_list_status`;

    const headers = {
      Authorization: `Bearer ${MAL_ACCESS_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const data = {
      is_rewatching: Number(isRewatching),
    };

    if (score !== null) {
      data["score"] = score;
    } else {
      data["score"] = 0;
    }

    if (numOfWatchEpisodes) {
      data["num_watched_episodes"] = numOfWatchEpisodes;
      data["status"] = status;
    } else {
      data["num_watched_episodes"] = 1;

      data["status"] = "completed";
    }

    let response = await fetch(url, {
      method: "PATCH",
      headers,

      body: new URLSearchParams(data).toString(),
    });
    response = await response.json();
    console.log("Response from MAL After Syncing: ", response);

    // sending to content scripts in CR site
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = tabs[0].id;

    const metaData = await browser.tabs.sendMessage(tabId, {
      type: "stop_syncing",
      site: "CR",
    });
  } catch (err) {
    console.log("Error in function - syncTheMediaMAL: ", response);
  }
}
