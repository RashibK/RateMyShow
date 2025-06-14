import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// export const fetchUserData = createAsyncThunk('user/fetchUserData', async () => {
//     console.log('Hey I am in fetching data thing!!!')
//     // // get access_token from session storage
//     let result = await browser.storage.session.get('mal_access_token');

//     const malAccessToken = result.mal_access_token;

//     // do a fetch call to get user's data
//     let response = await fetch('https://api.myanimelist.net/v2/users/@me?fields=anime_statistics', {
//         headers: {
//             'Authorization': `Bearer ${malAccessToken}`
//         }
//     });
//     const userInfo = await response.json();

//     await browser.storage.session.set({user_data: userInfo});

//     return userInfo;

// })

// function onDisconnect(provider) {
//   // const dispatch = useDispatch();

//   if (provider === "MyAnimeList") {
//       const response = await browser.runtime.sendMessage({
//         type: "logout",
//         provider: provider,
//       });
//       if (response.message === "mal_tokens_deleted") {
//         dispatch(deleteAnimeUserData());
//       }
//     }
//   }

export const onDisconnectProvider = createAsyncThunk(
  "user/onDisconnectProvider",
  async (provider, thunkAPI) => {
    if (provider === "MyAnimeList") {
      const response = await browser.runtime.sendMessage({
        type: "logout",
        provider: provider,
      });
      if (response.message === "myanimelist_tokens_deleted") {
        thunkAPI.dispatch(deleteAnimeUserData());
      }
    }
  }
);

const initialState = {
  animeUserData: null,
  tvShowUserData: null,
  movieUserData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addAnimeUserData: (state, action) => {
      state.animeUserData = action.payload;
    },
    addMovieUserData: (state, action) => {
      state.movieUserData = action.payload;
    },
    addTvShowUserData: (state, action) => {
      state.tvShowUserData = action.payload;
    },

    deleteAnimeUserData: (state) => {
      state.animeUserData = null;
    },
    deleteMovieUserData: (state) => {
      state.movieUserData = null;
    },
    deleteTvShowUserData: (state) => {
      state.tvShowUserData = null;
    },
  },
});

export const {
  addAnimeUserData,
  addMovieUserData,
  addTvShowUserData,
  deleteAnimeUserData,
  deleteMovieUserData,
  deleteTvShowUserData,
} = userSlice.actions;
export default userSlice.reducer;
