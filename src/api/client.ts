import axios from "axios";

const client = axios.create({
  baseURL: process.env.SERVER_URL, 
  timeout: 10000,
});

// Request interceptor (add auth token)
client.interceptors.request.use(
  async (config) => {
    const token = "your-auth-token"; 
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
