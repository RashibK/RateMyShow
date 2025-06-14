import { providerMap } from "../utils/providerMap";

// check for user_data
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, provider } = message;
  const specificProvider = providerMap[provider];

  if (type === "send_user_data") {
    if (specificProvider?.getUserData) {
      specificProvider.getUserData(sendResponse);
    } else if (provider == "all") {
      (async () => {
        const data = await getAllConnectedProviders();
        sendResponse(data);
      })();
    }
  } else if (type === "start_auth") {
    if (specificProvider?.startAuth) {
      (async () => {
        const userData = await specificProvider.startAuth();
        sendResponse(userData);
      })();
    }
  } else if (type === "logout") {
    if (specificProvider) {
      (async () => {
        browser.storage.local.remove(`${provider.toLowerCase()}_refresh_token`);
        let data = await browser.storage.session.get("connected_providers");
        data = data.connected_providers;
        console.log("data is from logout bg", data);

        const category = specificProvider.category;

        if (data[category]?.name === provider) {
          data[category].name = null;
          data[category].userData = null;
          await browser.storage.session.set({ connected_providers: data });
        }
        sendResponse({
          message: `${provider.toLowerCase()}_tokens_deleted`,
        });
      })();
    }
  } else if (type === "connected_provider") {
    if (message.action === "update_connected_provider") {
      updateConnectedProviderBG(message.provider, message.userData);
    }
  }
  return true;
});
// ---------------------------------------------------------------------------------Check Connected Providers --------------------------------------------------
async function getAllConnectedProviders() {
  let data = await browser.storage.session.get("connected_providers");
  console.log("session stored data", data);
  data = data.connected_providers || {
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
