const host = "10.0.0.136:3000";

export async function postAPI(router: string, params = {}) {
  return await fetch(`http://${host}${router}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(params),
  });
}
