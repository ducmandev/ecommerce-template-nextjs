import axios from "axios";

// Axios instance dùng trên server (route handler, server actions, v.v.)
// Dùng để proxy request tới backend thật.
// URL backend thật nên đặt ở env: API_BASE_URL
const API_BASE_URL = process.env.API_BASE_URL || "https://example.com"; // TODO: thay bằng URL backend thật

export const serverHttp = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

serverHttp.interceptors.request.use(
  (config) => {
    // Nếu backend dùng token, có thể gắn ở đây từ env hoặc từ header request
    // Ví dụ:
    // if (process.env.API_TOKEN) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${process.env.API_TOKEN}`,
    //   };
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

serverHttp.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

