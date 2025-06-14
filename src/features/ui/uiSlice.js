import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProviders: {
    anime: "MyAnimeList",
    movie: "Trakt",
    tvShow: "Trakt",
  },

  connectedProviders: {
    anime: null,
    movie: null,
    tvShow: null,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    updateSelectedProvider: (state, action) => {
      const { category, provider } = action.payload;
      state.selectedProviders[category] = provider;
    },
    updateConnectedProvider: (state, action) => {
      const { category, provider } = action.payload;
      state.connectedProviders[category] = provider;
    },
  },
});

export const { updateSelectedProvider, updateConnectedProvider } =
  uiSlice.actions;
export default uiSlice.reducer;
