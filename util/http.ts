import { navigate } from "../navigation/RootNavigation";
import { clearUserAuth, getUserToken } from "./user";

const host = "10.0.0.136:3000"; // PC
// const host = "10.0.0.172:3000"; // Desktop

export const ImgOssHost = "img.heimao.icu";

const myFetch = async (currentHost: string, params) => {
  if (
    currentHost.indexOf(host) >= 0 &&
    params?.headers?.["Content-Type"] === "application/json;charset=utf-8"
  ) {
    let token;
    try {
      token = await getUserToken();
    } catch (e) {
      console.warn(e);
    }

    return await fetch(currentHost, {
      ...params,
      body: JSON.stringify({
        ...params.body,
        token: token,
      }),
    });
  }

  return await fetch(currentHost, params);
};

const handleResponse = async (response: Response) => {
  const res: { ok: boolean; json: any } = {
    ok: response.ok,
    json: {},
  };

  if (response.ok) {
    try {
      res.json = await response.json();
    } catch (e) {
      console.warn(e);
    }
  } else if (response.status === 401) {
    clearUserAuth();
    navigate("登录/注册");
  }

  return res;
};

export async function postAPI(router: string, params = {}) {
  const response = await myFetch(`http://${host}${router}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: params,
  });

  return await handleResponse(response);
}

export async function formPost(formData: FormData) {
  return await myFetch(`http://${ImgOssHost}`, {
    method: "POST",
    body: formData,
  });
}

export async function getAPI(router: string) {
  const response = await myFetch(`http://${host}${router}`, { method: "GET" });

  return await handleResponse(response);
}
