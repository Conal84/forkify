import { TIMEOUT_SECS } from './config.js';

/*
A timeout function to race the getJSON function
After s seconds timeout will reject Promise
*/
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // race fetch vs timeout function to prevent slow connecitons running fetch for too long
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECS)]);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} ${res.status}`);
    }
    return data;
  } catch (err) {
    // throwing the error rejects the promise, the error will then be handled by the calling function
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    // race fetch vs timeout function to prevent slow connecitons running fetch for too long
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECS)]);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} ${res.status}`);
    }
    return data;
  } catch (err) {
    // throwing the error rejects the promise, the error will then be handled by the calling function
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    // race fetch vs timeout function to prevent slow connecitons running fetch for too long
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECS)]);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} ${res.status}`);
    }
    return data;
  } catch (err) {
    // throwing the error rejects the promise, the error will then be handled by the calling function
    throw err;
  }
};*/
