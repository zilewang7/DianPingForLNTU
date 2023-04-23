import { navigate } from "../navigation/RootNavigation";
import { clearUserAuth } from "./user";

const host = "10.0.0.136:3000"; // PC
// const host = "10.0.0.172:3000"; // Desktop

const handleResponse = async (response: Response) => {
  const res: any = {
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
    navigate("登录/注册", { screen: "登录/注册" });
  }

  return res;
};

export async function postAPI(router: string, params = {}) {
  const response = await fetch(`http://${host}${router}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(params),
  });

  const res: any = {
    ok: response.ok,
    json: {},
  };

  if (response.ok) {
    try {
      res.json = await response.json();
    } catch (e) {
      console.warn(e);
    }
  }

  return res;
}

export async function getAPI(router: string) {
  const response = await fetch(`http://${host}${router}`, { method: "GET" });

  const res: any = {
    ok: response.ok,
    json: {},
  };

  if (response.ok) {
    try {
      res.json = await response.json();
    } catch (e) {
      console.warn(e);
    }
  }

  return res;
}
