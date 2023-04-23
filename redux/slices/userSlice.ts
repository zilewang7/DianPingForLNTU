import { createSlice } from "@reduxjs/toolkit";

interface User {
  username: string;
  avatarUrl?: string;
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
