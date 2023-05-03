import { postAPI } from "../util/http";

export const createPost = async (post) => {
  return await postAPI("/post/create", post);
};
