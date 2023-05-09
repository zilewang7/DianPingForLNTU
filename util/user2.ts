import { getUserInfo } from "../api/user.api";
import { updateUser } from "../redux/slices/userSlice";
import { store } from "../redux/store";

export const pullUser = () => {
  getUserInfo(store.getState().user.username).then((userInfo) => {
    // 更新用户数据
    store.dispatch(updateUser(userInfo.json));
  });
};
