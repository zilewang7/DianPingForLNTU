import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { store } from "../redux/store";
import { setUser, clearUser } from "../redux/slices/userSlice";

export const setUserAuth = (json) => {
  setItemAsync("jwtToken", json.token);

  store.dispatch(setUser({ ...json.user }));
};

export const clearUserAuth = () => {
  deleteItemAsync("jwtToken");

  store.dispatch(clearUser());
};

export const getUserToken = async () => {
  const token = await getItemAsync("jwtToken");
  if (token) {
    return token;
  } else {
    clearUserAuth();
  }
};
