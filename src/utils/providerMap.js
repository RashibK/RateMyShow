import { AniListAuth, getAniListUserData } from "../background/AniListOAuth";
import { getMALUserData, MALAuth } from "../background/MALOAuth";

export const providerMap = {
  MyAnimeList: {
    category: "anime",
    startAuth: MALAuth,
    getUserData: getMALUserData,
  },

  AniList: {
    category: "anime",
    startAuth: AniListAuth,
    getUserData: getAniListUserData,
  },
};
