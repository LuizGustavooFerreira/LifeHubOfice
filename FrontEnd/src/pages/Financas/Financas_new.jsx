import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../../api/api";
import "./Financas.css";

export default function Financas() {
  const [transacoes, setTransacoes] = useState([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [descricao, setDescricao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [conta, setConta] = useState(null);

  useEffect(() => {
    carregarTransacoes();
    carregarConta();
  }, []);

  async function carregarConta() {
    try {
      const resposta = await api.get("contas/");
      if (resposta.data && resposta.data.length > 0) {
        setConta(resposta.data[0]); // Primeira conta
      }
    } catch (err) {
      console.error("Erro ao carregar conta:", err);
    }
  }

  async function carregarTransacoes() {
    try {
      setCarregando(true);
      const resposta = await api.get("transacoes/");
      setTransacoes(resposta.data || []);
    } catch (err) {
      console.error("Erro ao carregar transações:", err);
      setErro("Erro ao carregar transações");
    } finally {
      setCarregando(false);
    }
  }

  async function adicionar() {
    if (!valor) return;

    try {
      const resposta = await api.post("transacoes/", {
        tipo: tipo === "entrada" ? "entrada" : "saida",
        descricao: descricao,
        valor: parseFloat(valor),
        data: new Date().toISOString().split("T")[0],
        conta: conta?.id
      });

      setTransacoes([...transacoes, resposta.data]);
      setValor("");
      setDescricao("");
    } catch (err) {
      console.error("Erro ao criar transação:", err);
      setErro("Erro ao criar transação");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza?")) return;

    try {
      await api.delete(`transacoes/${id}/`);
      setTransacoes(transacoes.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setErro("Erro ao excluir transação");
    }
  }

  const saldo = transacoes.reduce((acc, item) => {
    return item.tipo === "entrada"
      ? acc + parseFloat(item.valor)
      : acc - parseFloat(item.valor);
  }, 0);

  return (
    <Layout titulo="Finanças">
      {erro && <div style={{ color: 'red', padding: '10px' }}>{erro}</div>}

      <h2>Saldo: R$ {saldo.toFixed(2)}</h2>

      <div className="card">
        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          type="number"
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

        <button onClick={adicionar} disabled={carregando}>
          {carregando ? "..." : "Adicionar"}
        </button>
      </div>

      <div className="lista">
        {transacoes.map(item => (
          <div key={item.id} className="item">
            <span>
              {item.tipo === "entrada" ? "💰" : "💸"} R$ {parseFloat(item.valor).toFixed(2)}
            </span>

            <span>{item.descricao}</span>

            <button onClick={() => excluir(item.id)}>🗑</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
