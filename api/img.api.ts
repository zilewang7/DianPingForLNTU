import { formPost, postAPI } from "../util/http";

export const getUploadSign = (token: string) => {
  return postAPI("/oos/uploadSgin", { token });
};

export const uploadImage = (formData: FormData) => {
  return formPost(formData);
};

export const updateAvatarUrl = (token: string, avatarUrl: string) => {
  return postAPI("/user/update", { token, update: { avatarUrl } });
};
