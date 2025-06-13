import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSelectedAnimeProvider: "MyAnimeList",
  currentConnectedAnimeProvider: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    updateSelectedAnimeProvider: (state, action) => {
      state.currentSelectedAnimeProvider = action.payload;
    },
    updateConnectedAnimeProvider: (state, action) => {
      state.currentConnectedAnimeProvider = action.payload;
    },
  },
});

export const { updateSelectedAnimeProvider, updateConnectedAnimeProvider } = uiSlice.actions;
export default uiSlice.reducer;
