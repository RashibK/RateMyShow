import {
  AniListAuth,
  getAniListUserData,
} from "../background/auth/AniListOAuth";
import { logOut } from "../background/background";
import { getMALUserData, MALAuth } from "../background/auth/MALOAuth";
import { AniListSync } from "../background/sync/AniListSync";
import { MALSync } from "../background/sync/MALSync";
import { RateMAL } from "../background/rate/MALRate";

export const providerMap = {
  MyAnimeList: {
    category: "anime",
    startAuth: MALAuth,
    getUserData: getMALUserData,
    logOutUser: () => {
      return logOut("myanimelist_refresh_token", "anime", "MyAnimeList");
    },
    syncMedia: (metaData, mediaDetailsFromTitle) =>
      MALSync(metaData, mediaDetailsFromTitle),
    rateMedia:(data, sendResponse) =>  RateMAL(data, sendResponse),
  },

  AniList: {
    category: "anime",
    startAuth: (sendResponse) => AniListAuth(sendResponse),
    getUserData: getAniListUserData,
    logOutUser: () => {
      return logOut("anilist_access_token", "anime", "AniList");
    },
    syncMedia: (metaData, mediaDetailsFromTitle) =>
      AniListSync(metaData, mediaDetailsFromTitle),
  },
};
