import { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function Habitos() {

  const [nome, setNome] = useState("");
  const [lista, setLista] = useState([]);

  const hoje = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("habitos")) || [];
    setLista(dados);
  }, []);

  useEffect(() => {
    localStorage.setItem("habitos", JSON.stringify(lista));
  }, [lista]);

  function adicionar() {
    if (!nome) return;

    setLista([
      ...lista,
      { id: Date.now(), nome, dias: {} }
    ]);

    setNome("");
  }

  function toggle(id) {
    setLista(lista.map(h => {
      if (h.id === id) {
        return {
          ...h,
          dias: {
            ...h.dias,
            [hoje]: !h.dias[hoje]
          }
        };
      }
      return h;
    }));
  }

  function excluir(id) {
    setLista(lista.filter(h => h.id !== id));
  }

  return (
    <Layout titulo="Hábitos">

      <div className="card">
        <input
          placeholder="Novo hábito"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button onClick={adicionar}>Adicionar</button>
      </div>

      <div className="lista">
        {lista.map(h => (
          <div key={h.id} className="item">

            <span>{h.nome}</span>

            <button onClick={() => toggle(h.id)}>
              {h.dias[hoje] ? "✔️" : "⬜"}
            </button>

            <button onClick={() => excluir(h.id)}>🗑</button>

          </div>
        ))}
      </div>

    </Layout>
  );
}