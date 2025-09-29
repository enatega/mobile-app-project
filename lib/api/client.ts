import axios from "axios";

const client = axios.create({
  baseURL: "https://api.example.com", // 🔥 replace with your backend
  timeout: 10000,
});

// Request interceptor (add auth token)
client.interceptors.request.use(
  async (config) => {
    // Example: attach token from async storage or secure store
    const token = "your-auth-token"; // TODO: replace with real fetch
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors globally)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export { client };
