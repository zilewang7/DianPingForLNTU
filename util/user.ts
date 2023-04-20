import { deleteItemAsync, setItemAsync } from "expo-secure-store";
import { store } from "../redux/store";
import { setUser, clearUser } from "../redux/slices/userSlice";

export const setUserAuth = (json) => {
  setItemAsync("jwtToken", json.token);

  const { username } = json.user;
  store.dispatch(setUser({ username }));
};

export const clearUserAuth = () => {
  deleteItemAsync("jwtToken");

  store.dispatch(clearUser());
};
