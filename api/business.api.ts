import { postAPI } from "../util/http";

export const getBusinessList = (filter) => {
  return postAPI("/business/list", filter);
};
