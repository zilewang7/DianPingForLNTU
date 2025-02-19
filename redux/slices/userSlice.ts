import { createSlice } from "@reduxjs/toolkit";

export interface User {
  username: string;
  avatarUrl?: string;
  starBusiness?: string[];
  _id?: string;
  posts?: string[];
  starPost?: string[];
  follow?: string[];
  fans?: string[];
}

const initialState: User = {
  username: "未登录",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      return (state = action.payload);
    },
    clearUser: (state) => {
      return initialState;
    },
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
