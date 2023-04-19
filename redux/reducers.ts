import { createSlice } from '@reduxjs/toolkit';

// 创建 Redux slice
const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    clearUser: (state) => {
      return {};
    },
  },
});

// 导出 reducer 和 actions
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
