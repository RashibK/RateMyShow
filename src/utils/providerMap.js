import { AniListAuth, getAniListUserData } from "../background/AniListOAuth";
import { logOut } from "../background/background";
import { getMALUserData, MALAuth } from "../background/MALOAuth";

export const providerMap = {
  MyAnimeList: {
    category: "anime",
    startAuth: MALAuth,
    getUserData: getMALUserData,
    logOutUser: () => {return logOut('myanimelist_refresh_token', 'anime', 'MyAnimeList')}
  },

  AniList: {
    category: "anime",
    startAuth: (sendResponse) => AniListAuth(sendResponse),
    getUserData: getAniListUserData,
    logOutUser: () => {return logOut('anilist_access_token', 'anime', 'AniList')}
  },
};
