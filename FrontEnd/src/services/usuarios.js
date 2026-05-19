import api from "../api/api";

export const listarUsuarios = () => {
  return api.get("usuarios/");
};

export const criarUsuario = (data) => {
  return api.post("usuarios/", data);
};

export const deletarUsuario = (id) => {
  return api.delete(`usuarios/${id}/`);
};