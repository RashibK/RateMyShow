import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const onDisconnectProvider = createAsyncThunk(
  "user/onDisconnectProvider",
  async (provider, thunkAPI) => {
    const response = await browser.runtime.sendMessage({
      type: "logout",
      provider: provider,
    });
    if (response.message === `${provider.toLowerCase()}_tokens_deleted`) {
      thunkAPI.dispatch(deleteAnimeUserData());
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
