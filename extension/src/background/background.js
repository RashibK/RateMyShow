import { getProviderIdsFromTitle } from "../utils/animeUtils";
import { providerMap } from "../utils/providerMap";

// check for user_data
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, provider } = message;
  const specificProvider = providerMap[provider];

  console.log("category and provider in bg", type, provider, specificProvider);

  if (type === "send_user_data") {
    if (specificProvider?.getUserData) {
      specificProvider.getUserData(sendResponse);
    } else if (provider == "all") {
      (async () => {
        let data = await getAllConnectedProviders();
        //  if no connected providers - check for Tokens;
        if (!(data?.anime || data?.movie || data?.tvShow)) {
          await checkTokensForAuth(); // For automatically redoing the oauth with api calls if refresh/access tokens are present
        }
        data = await getAllConnectedProviders();
        sendResponse(data);
      })();
      return true;
    }
  } else if (type === "start_auth") {
    if (specificProvider?.startAuth) {
      (async () => {
        const userData = await specificProvider.startAuth(sendResponse);
        sendResponse(userData);
      })();
      return true;
    }
  } else if (type === "logout") {
    if (specificProvider?.logOutUser) {
      (async () => {
        const response = await specificProvider.logOutUser();
        sendResponse({ message: response });
      })();
      return true;
    }
  } else if (type === "connected_provider") {
    if (message.action === "update_connected_provider") {
      (async () => {
        // const userData = await getUserDataFromAnyProviderResponse(
        //   message.provider,
        //   message.userData
        // );
        updateConnectedProviderBG(message.provider, message.userData);
        sendResponse(message.userData); // For updating the data in login in addAnimeUserData section for redux
      })();
      return true;
    }
  } else if (message.type === "sync_media") {
    (async () => {
      await handleMediaAction(message, "syncMedia");
    })();
    return true;
  } else if (message.type === "rate_media") {
    if (message.action === "send_media_detail") {
      (async () => {
        console.log("I am in bg inside of rate_media");
        const mediaDetailsWithId = await getCurrentMediaId(message);
        sendResponse(mediaDetailsWithId);
      })();
    } else if (message.action === "rate") {
      console.log("I am inside of rating thing");
      (async () => {
        const providers = await getAllConnectedProviders();
        const providerCategory = message.data.dataFromSite?.category;
        const connectedProvider = providers[providerCategory];

        // check if any provider for that category is connected or not:
        if (connectedProvider?.name) {
          const specificProviderMap = providerMap[connectedProvider.name];
          await specificProviderMap?.rateMedia(message.data, sendResponse);
        }
      })();
      return true;
    }

    return true;
  }

  return true;
});
// ---------------------------------------------------------------------------------Check Connected Providers --------------------------------------------------
async function getAllConnectedProviders() {
  let data = await browser.storage.session.get("connected_providers");
  console.log("session stored data", data);
  data = data?.connected_providers || {
    anime: { name: null, userData: null },
    movie: { name: null, userData: null },
    tvShow: { name: null, userData: null },
  };

  return {
    anime: data.anime?.userData ? data.anime : null,
    movie: data.movie?.userData ? data.movie : null,
    tvShow: data.tvShow?.userData ? data.tvShow : null,
  };
}

export async function updateConnectedProviderBG(provider, userData) {
  let data = await browser.storage.session.get("connected_providers");
  data = data.connected_providers || {
    anime: { name: null, userData: null },
    movie: { name: null, userData: null },
    tvShow: { name: null, userData: null },
  };

  let category = null;

  //check which provider called this function; anime; movie or tv shows
  if (provider === "MyAnimeList" || provider === "AniList") {
    category = "anime";
  } else if (provider === "trakt") {
    category = "tvShow";
  }

  data[category].name = provider;
  data[category].userData = userData;

  await browser.storage.session.set({ connected_providers: data });
  console.log(
    "updated connected provider in bg",
    await browser.storage.session.get("connected_providers")
  );
}

export async function getUserDataFromAnyProviderResponse(provider, response) {
  if (provider === "AniList") {
    const username = response.data.Viewer.name;
    const image = response.data.Viewer.avatar.medium;
    return { username, image };
  }
  if (provider === "MyAnimeList") {
    const username = response.name;
    const image = response.picture;
    return { username, image };
  }
}

export async function logOut(token_key, category, provider) {
  console.log(
    "we are inside of logout function",
    token_key,
    category,
    provider
  );
  await browser.storage.local.remove(token_key);

  let data = await browser.storage.session.get("connected_providers");
  data = data.connected_providers;

  if (data[category]?.name === provider) {
    data[category].name = null;
    data[category].userData = null;
    await browser.storage.session.set({ connected_providers: data });

    return `${provider.toLowerCase()}_tokens_deleted`;
  }

  return { message: "provider_not_found" };
}

export async function handleMediaAction(message, mediaAction) {
  try {
    console.log("I am insideo");
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = tabs[0].id;

    const metaData = await browser.tabs.sendMessage(tabId, {
      type: "get_metadata",
      site: message.site,
    });
    console.log("metadata that I got in bg: ", metaData);
    //find connected providers
    const providers = await getAllConnectedProviders();
    console.log("all providers: ", providers);
    const providerCategory = metaData?.category; // anime | movie | tvShow
    console.log("provider category", providerCategory);
    const connectedProvider = providers[providerCategory];
    console.log("connected Provider", connectedProvider);

    // check if any provider for that category is connected or not:
    if (connectedProvider?.name) {
      const specificProviderMap = providerMap[connectedProvider.name];

      console.log("specific provider map", specificProviderMap);
      const mediaIdDetails = await getProviderIdsFromTitle(metaData);
      specificProviderMap?.[mediaAction](metaData, mediaIdDetails);
    } else {
      const isSent = await browser.storage.session.get("alert_sent");
      if (!isSent.alert_sent) {
        await browser.storage.session.set({ alert_sent: true });
        await browser.tabs.sendMessage(tabId, {
          type: "send_alert",
          message: `You are not logged in. Log in to any ${providerCategory} Provider and refresh the page.`,
        });
      }
    }
  } catch (err) {
    console.log("Error in Background: ", err);
  }
}

export async function getCurrentMediaId(message) {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const tabId = tabs[0].id;

  const metaData = await browser.tabs.sendMessage(tabId, {
    type: "get_metadata",
    site: message.site,
  });
  console.log("metadata that I got in bg: ", metaData);
  //find connected providers
  const providers = await getAllConnectedProviders();
  console.log("all providers: ", providers);
  const providerCategory = metaData?.category; // anime | movie | tvShow
  console.log("provider category", providerCategory);
  const connectedProvider = providers[providerCategory];
  console.log("connected Provider", connectedProvider);

  // check if any provider for that category is connected or not:
  if (connectedProvider?.name) {
    const specificProviderMap = providerMap[connectedProvider.name];

    console.log("specific provider map", specificProviderMap);
    const dataFromProvider = await getProviderIdsFromTitle(metaData);
    return { metaData, dataFromProvider };
  }
}

export async function checkTokensForAuth() {
  console.log("I am inside of checkTokensForAuth");

  // check for refresh/access tokens for anime providers
  // 1. MyAnimeList
  const malRefreshT = await browser.storage.local.get(
    "myanimelist_refresh_token"
  );

  const malRefreshToken = malRefreshT.myanimelist_refresh_token;
  if (malRefreshToken) {
    await providerMap.MyAnimeList.getUserData();
    console.log("MA Token is there", malRefreshToken);
  }

  // 2. AniList
  const anilist_access_token = await browser.storage.local.get(
    "anilist_access_token"
  );
  const ANILIST_ACCESS_TOKEN = anilist_access_token.anilist_access_token;
  if (ANILIST_ACCESS_TOKEN) {
    await providerMap.AniList.getUserData();
    console.log("AniList Access Token is there", ANILIST_ACCESS_TOKEN);
  }

  // check for refresh/access tokens for movies/TV providers - TODO
}
