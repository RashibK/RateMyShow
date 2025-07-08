export async function RateAniList(rateData, sendResponse) {
  try {
    const anilist_access_token = await browser.storage.local.get(
      "anilist_access_token"
    );
    const ANILIST_ACCESS_TOKEN = anilist_access_token.anilist_access_token;

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

    const anilistId = rateData?.metaData?.data?.Media?.id;

    let status = null;
    if (rateData.status === "completed") {
      status = "COMPLETED";
    } else {
      status = "CURRENT";
    }

    let variables = {
      mediaId: anilistId,
      status: `${status}`,
      progress: rateData?.episode,
      score: rateData?.ratingNum,
      repeat: 0, // currently doesn't support rewatching
    };

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ANILIST_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    response = await response.json();
    sendResponse(response);
  } catch (err) {
    console.log("Error in RateAniList: ", err);
  }
}
