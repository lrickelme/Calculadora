import axios from "axios";
import qs from "qs";

const API_URL = "http://10.12.130.72:1337";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "bypass-tunnel-reminder": "qualquer",
  },
});

api.interceptors.request.use((config) => {
  console.log("Enviando requisição para:", config.url);
  return config;
});

export default api;
