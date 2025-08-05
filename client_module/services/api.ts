import axios from "axios";

const API_URL = "http://10.12.130.72:1337";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  console.log("Enviando requisição para:", config.url);
  return config;
});

export default api;
