const host = "10.0.0.136:3000";

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
