import { createSlice } from "@reduxjs/toolkit";
import { Theme, defaultTheme } from "../../constants/themes";

const initialState: Theme = defaultTheme;

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    setTheme: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
