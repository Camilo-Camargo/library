export function apiHTTPURL(path: string) {
  return `${import.meta.env.VITE_API_URL}/${path}`;
}

export async function apiGet(path: string) {
  return await fetch(apiHTTPURL(path));
}

export async function apiPost(path: string, data?: {}) {
  return await fetch(apiHTTPURL(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function apiDelete(path: string, data?: {}) {
  return await fetch(apiHTTPURL(path), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function apiPut(path: string, data?: {}) {
  return await fetch(apiHTTPURL(path), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function apiResourceUrl(path: string) {
  return apiHTTPURL(path);
}

/*
 * FIXME: Add support to websockets
 * export function apiWebSocketUrl(path: string) {
  return `ws://${API_DOMAIN}:${PORT}${path}`;
}*/

export async function apiPostFormData(path: string, body: FormData) {
  return await fetch(apiHTTPURL(path), {
    method: "POST",
    body: body,
  });
}

export async function apiPutFormData(path: string, body: FormData) {
    return await fetch(apiHTTPURL(path), {
      method: "PUT",
      body: body,
    });
  }
