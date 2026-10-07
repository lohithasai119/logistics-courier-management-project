import axios from "axios";

// Local dev  -> http://localhost:3000   (see .env.development)
// Production -> deployed json-server    (see .env.production)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export default api;
