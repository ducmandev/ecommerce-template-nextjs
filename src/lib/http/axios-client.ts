import axios from "axios";

// Axios instance dùng cho client (browser) gọi API nội bộ Next (/api/...)
// Với mô hình B (BFF), client chỉ nên gọi route handler, không gọi thẳng backend.
// baseURL để rỗng -> dùng relative URL (/api/...)
export const clientHttp = axios.create({
  baseURL: "",
  withCredentials: true,
  timeout: 15000,
});

// Interceptor request: gắn token nếu sau này bạn lưu ở localStorage/cookie
clientHttp.interceptors.request.use(
  (config) => {
    // Ví dụ (tùy bạn triển khai):
    // const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`,
    //   };
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: chuẩn hoá lỗi
clientHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bạn có thể log / toast lỗi ở đây
    return Promise.reject(error);
  }
);

