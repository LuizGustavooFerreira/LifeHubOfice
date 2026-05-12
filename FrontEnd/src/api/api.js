import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/"
});

// Adiciona token JWT a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Trata erros (e.g., token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/usuario/login";
    }
    return Promise.reject(error);
  }
);

export default api;