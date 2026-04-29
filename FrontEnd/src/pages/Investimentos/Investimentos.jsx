import { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function Investimentos() {

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [taxa, setTaxa] = useState("");
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("investimentos")) || [];
    setLista(dados);
  }, []);

  useEffect(() => {
    localStorage.setItem("investimentos", JSON.stringify(lista));
  }, [lista]);

  function adicionar() {
    if (!nome || !valor || !taxa) return;

    setLista([
      ...lista,
      {
        id: Date.now(),
        nome,
        valor: Number(valor),
        taxa: Number(taxa)
      }
    ]);

    setNome("");
    setValor("");
    setTaxa("");
  }

  function excluir(id) {
    setLista(lista.filter(i => i.id !== id));
  }

  function rendimento(valor, taxa) {
    // simples: 1 mês
    return (valor * (taxa / 100)).toFixed(2);
  }

  function total() {
    return lista.reduce((acc, i) => acc + i.valor, 0);
  }

  return (
    <Layout titulo="Investimentos">

      <h2>Total investido: R$ {total()}</h2>

      {/* INPUT */}
      <div className="card">
        <input
          placeholder="Nome (ex: CDB)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Valor (R$)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <input
          placeholder="Taxa % (ex: 10)"
          value={taxa}
          onChange={(e) => setTaxa(e.target.value)}
        />

        <button onClick={adicionar}>Adicionar</button>
      </div>

      {/* LISTA */}
      <div className="lista">
        {lista.map(i => (
          <div key={i.id} className="item">

            <div>
              <strong>{i.nome}</strong>
              <p>R$ {i.valor}</p>
              <p>Rendimento: R$ {rendimento(i.valor, i.taxa)}</p>
            </div>

            <button onClick={() => excluir(i.id)}>🗑</button>

          </div>
        ))}
      </div>

    </Layout>
  );
}