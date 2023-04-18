import { postAPI } from "../util/http";

import CryptoJS from "crypto-js"

export const createUser =  (username: string, password: string) => {
  const passwordHash = CryptoJS.MD5(password).toString();
  
  return postAPI("/user/create", {
    username: username,
    passwordHash: passwordHash,
  });
};

export const userLogin =  (username: string, password: string) => {
    const passwordHash = CryptoJS.MD5(password).toString();
    
    return postAPI("/user/login", {
      username: username,
      passwordHash: passwordHash,
    });
  };