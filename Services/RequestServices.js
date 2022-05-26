import { authUrl, serviceUrl } from "./Constants";

export function postRequest(url, param, token) {
  return fetch(serviceUrl + url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(param),
  })
    .then((response) => response.json())

    .catch((error) => {
      console.error(error);
    });
}

export function uploadImage(url, param, token) {
  return fetch(serviceUrl + url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      "auth-token": token,
    },
    body: param,
  })
    .then((response) => response.json())

    .catch((error) => {
      console.error(error);
    });
}

export function authRequest(url, param) {
  return fetch(authUrl + url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(param),
  })
    .then((response) => response.json())

    .catch((error) => {
      console.error(error);
    });
}
