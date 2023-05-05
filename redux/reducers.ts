import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import themeReducer from "./slices/themeSlice";
import businessReducer from "./slices/businessSlice";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  business: businessReducer,
});

export default rootReducer;
