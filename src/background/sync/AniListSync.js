import { getProviderIdsFromTitle } from "../../utils/animeUtils";

export async function AniListSync(metaData) {
  console.log("I am inside of AniList Sync");

  try {
    const result = await getProviderIdsFromTitle(metaData);
    const malId = result?.data?.Media?.idMal;
    const anilistId = result?.data?.Media?.id;

    let status = null;
    if (
      result?.data?.Media?.episodes === metaData?.episode_number ||
      !metaData?.episode_number
    ) {
      status = "COMPLETED";
    } else {
      status = "CURRENT";
    }

    const isRewatching = false; // currently no option to log as rewatched

    const numOfWatchEpisodes = metaData?.episode_number;

    await syncMediaAniList(
      anilistId,
      status,
      Number(isRewatching),
      numOfWatchEpisodes,
      null
    );
  } catch (error) {
    console.log("Error in AniListSync function: ", error);
  }
}

export async function syncMediaAniList(
  anilistId,
  status,
  isRewatching,
  numOfWatchEpisodes,
  score
) {
  const anilist_access_token = await browser.storage.local.get(
    "anilist_access_token"
  );
  const ANILIST_ACCESS_TOKEN = anilist_access_token.anilist_access_token;

  // if (!anilist_access_token.anilist_access_token) {
  // }
  const url = "https://graphql.anilist.co";

  const query = `mutation SaveMediaListEntry($mediaId: Int, $status: MediaListStatus, $score: Float, $progress: Int, $repeat: Int) {
  SaveMediaListEntry(mediaId: $mediaId, status: $status, score: $score, progress: $progress, repeat: $repeat) {
    mediaId
    progress
    score
    status
    startedAt {
      day
      month
      year
    }
    updatedAt
  }
}
`;

  let variables = {
    mediaId: anilistId,
    status: `${status}`,
    progress: numOfWatchEpisodes || 1,
  };

  console.log(
    "Here are the data that I have: ",
    anilistId,
    status,
    numOfWatchEpisodes
  );
  variables["score"] = score || 0;
  variables["repeat"] = 0; // currently no option to determine if it's a rewatch or not;

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANILIST_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  response = await response.json();
  console.log("here is the response from syncMediaAniList: ", response);
  if (response?.data?.SaveMediaListEntry) {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = tabs[0].id;

    const metaData = await browser.tabs.sendMessage(tabId, {
      type: "stop_syncing",
      site: "CR",
    });
  }
}
