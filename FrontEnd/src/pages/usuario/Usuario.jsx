import { useEffect, useState } from "react";
import { listarUsuarios } from "../services/usuarios";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    listarUsuarios().then(res => setUsuarios(res.data));
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      {usuarios.map(u => (
        <p key={u.id}>{u.nome}</p>
      ))}
    </div>
  );
}

export default Usuarios;