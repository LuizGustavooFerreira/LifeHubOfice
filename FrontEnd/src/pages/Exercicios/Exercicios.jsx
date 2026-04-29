import { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function Exercicios() {

  const [nome, setNome] = useState("");
  const [tempo, setTempo] = useState("");
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("exercicios")) || [];
    setLista(dados);
  }, []);

  useEffect(() => {
    localStorage.setItem("exercicios", JSON.stringify(lista));
  }, [lista]);

  function adicionar() {
    if (!nome || !tempo) return;

    setLista([
      ...lista,
      {
        id: Date.now(),
        nome,
        tempo,
        data: new Date().toLocaleDateString()
      }
    ]);

    setNome("");
    setTempo("");
  }

  function excluir(id) {
    setLista(lista.filter(e => e.id !== id));
  }

  return (
    <Layout titulo="Exercícios">

      <div className="card">
        <input
          placeholder="Exercício"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Tempo (min)"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
        />

        <button onClick={adicionar}>Registrar</button>
      </div>

      <div className="lista">
        {lista.map(e => (
          <div key={e.id} className="item">

            <span>{e.nome}</span>
            <span>{e.tempo} min</span>
            <span>{e.data}</span>

            <button onClick={() => excluir(e.id)}>🗑</button>

          </div>
        ))}
      </div>

    </Layout>
  );
}