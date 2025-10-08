import axios from "axios";

const client = axios.create({
  baseURL: 'https://api-nestjs-enatega.up.railway.app', 
  // baseURL: process.env.SERVER_URL,
  timeout: 10000,
});

// Request interceptor (add auth token)
client.interceptors.request.use(
  async (config) => {
    // Todo: added static token for now
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkYzNkMjBjLWQyMGMtNDVhNy1hYTI4LWJkNjExZDQ1NzlkNiIsInRva2VuVmVyc2lvbiI6MCwiaWF0IjoxNzU5NTg3OTI5LCJleHAiOjE3NjIxNzk5Mjl9.n3PK9c5tWzbcmQJxmBw5J_GdDfMkkX-oKANFXDdchWE"; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export { client };
