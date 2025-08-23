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

export async function uploadImage(url, formData, token) {
  console.log('Starting upload...', {
    url: serviceUrl + url,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'auth-token': token,
    },
    body: formData,
  });

  try {
    const response = await fetch(serviceUrl + url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'auth-token': token,
      },
      body: formData,
    });

    console.log('Upload response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Upload failed with status ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Upload successful:', responseData);
    return responseData;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
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
