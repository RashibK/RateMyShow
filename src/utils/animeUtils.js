export async function getProviderIdsFromTitle(metaData) {
  const url = "https://graphql.anilist.co";

  const query = `
         query Query($search: String, $type: MediaType) {
      Media(search: $search, type: $type) {
        idMal
        id
        bannerImage
        title {
          native
          english
          romaji
        }
        startDate {
          day
          month
          year
        }
        episodes
      }
    }`;

  const variables = {
    search: `${metaData.title}`,
    type: "ANIME",
  };

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  response = await response.json();
  console.log("Here is the response I got from anilist: ", response);
  return response;
}

export function getAnimeTitleinCR(CRPageTitle, EpisodeTitle) {
  // removes the episode title and Wtch on Crunchyroll string from the title Document:
  // Title Structure: Anime Name + (English Dub): Optional + Episode Name: Optional + Watch on Crunchyroll;
  const regexSyntax = `${EpisodeTitle}\\s*-\\s*Watch on Crunchyroll$`;
  const re = new RegExp(regexSyntax);
  // remove the (English Dub) if present
  return CRPageTitle.replace(re, "").replace(/\s*\(English\s*Dub\)\s*/g, "");
}
