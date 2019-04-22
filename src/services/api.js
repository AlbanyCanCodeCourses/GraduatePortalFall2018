import axios from "axios";
import config from "../config";

const api = `${config.apiUrl}api`;

const send = (url, data = null, method = "POST") => {
  const token = localStorage.getItem("token");
  return axios(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    data: data ? JSON.stringify(data) : null
  }).then(response => response.data);
};

const upload = (url, image = null, method = "PUT") => {
  const token = localStorage.getItem("token");
  const data = new FormData();
  data.append("image", image);
  return axios(url, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    data
  }).then(response => response.data);
};


// Login, Fetch All Profiles, Batch Download, 
// New & Edit Profile use the "send" AJAX call
// -------------------------------------------
export const loginRequest = (username, password) => {
  return send(`${api}/login`, {
    username,
    password
  }).then(response => {
    if (response.token) localStorage.token = response.token;
    return response;
  });
};

export const fetchAllProfilesRequest = () => {
  return send(`${api}/graduates`, null, "GET");
};

export const fetchProfilesNewRequest = profileData => {
  return send(`${api}/graduates/new`, profileData).then(response => {
    if (response.token) localStorage.token = response.token;
    return response;
  });
};

export const fetchProfileEditRequest = profileData => {
  return send(`${api}/graduates/edit`, profileData, "PUT").then(response => {
    if (response.token) localStorage.token = response.token;
    return response;
  });
};

export const batchDownloadRequest = resumes => {
  return send(`${api}/download/resumes`, resumes).then(response => {
    return response;
  });
};

// Upload Image and Resume use the "upload" AJAX call
// --------------------------------------------------
export const uploadImageRequest = data => {
  return upload(`${api}/upload/image`, data).then(response => {
    if (response.token) localStorage.token = response.token;
    return response;
  });
};

export const uploadResumeRequest = data => {
  return upload(`${api}/upload/resume`, data).then(response => {
    if (response.token) localStorage.token = response.token;
    return response;
  });
};
