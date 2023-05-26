import { postAPI } from "../util/http";

export const createPost = async (post) => {
  return await postAPI("/post/create", post);
};

export const getPosts = async (posts) => {
  return await postAPI("/post/get", posts);
};

export const votePost = async (vote) => {
  return await postAPI("/post/vote", vote);
};

export const addPostStar = (uid: string) => {
  return postAPI("/user/addOrRemovePostStar", { uid });
};

export const commentPost = (uid, comment) => {
  return postAPI("/post/comment", { uid, comment });
};

export const voteComment = async (vote) => {
  return await postAPI("/post/voteComment", vote);
};

export const getPost = async (type: string) => {
  return await postAPI("/post/getPostList", { type });
};
