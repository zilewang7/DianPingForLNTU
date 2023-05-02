import { postAPI } from "../util/http";

export const getBusinessList = (filter) => {
  return postAPI("/business/list", { filter });
};

export const addBusinessStar = (address: string) => {
  return postAPI("/user/addOrRemoveBusinessStar", { address });
};
