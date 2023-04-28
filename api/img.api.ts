import { formPost, postAPI } from "../util/http";

export const getUploadSign = () => {
  return postAPI("/oos/uploadSgin");
};

export const uploadImage = (formData: FormData) => {
  return formPost(formData);
};

export const updateAvatarUrl = (avatarUrl: string) => {
  return postAPI("/user/update", { update: { avatarUrl } });
};
