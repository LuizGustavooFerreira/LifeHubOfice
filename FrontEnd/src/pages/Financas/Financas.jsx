import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "./Financas.css";

export default function Financas() {

  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [descricao, setDescricao] = useState("");
  const [lista, setLista] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("financas")) || [];
    setLista(dados);
  }, []);

  useEffect(() => {
    localStorage.setItem("financas", JSON.stringify(lista));
  }, [lista]);

  function adicionar() {
    if (!valor) return;

    setLista([
      ...lista,
      {
        id: Date.now(),
        valor: Number(valor),
        tipo,
        descricao
      }
    ]);

    setValor("");
    setDescricao("");
  }

  function excluir(id) {
    setLista(lista.filter(i => i.id !== id));
  }

  const saldo = lista.reduce((acc, item) => {
    return item.tipo === "entrada"
      ? acc + item.valor
      : acc - item.valor;
  }, 0);

  return (
    <Layout titulo="Finanças">

      <h2>Saldo: R$ {saldo}</h2>

      <div className="card">
        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <button onClick={adicionar}>Adicionar</button>
      </div>

      <div className="lista">
        {lista.map(item => (
          <div key={item.id} className="item">
            <span>
              {item.tipo === "entrada" ? "💰" : "💸"} R$ {item.valor}
            </span>

            <span>{item.descricao}</span>

            <button onClick={() => excluir(item.id)}>🗑</button>
          </div>
        ))}
      </div>

    </Layout>
  );
}