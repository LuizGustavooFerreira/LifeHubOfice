import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../../api/api";
import "./Financas.css";

export default function Financas() {
  const [transacoes, setTransacoes] = useState([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [descricao, setDescricao] = useState("");
  const [observacao, setObservacao] = useState("");
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
      if (resposta.data?.length > 0) {
        setConta(resposta.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function carregarTransacoes() {
    try {
      setCarregando(true);

      const resposta = await api.get("transacoes/");

      setTransacoes(resposta.data || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar transações");
    } finally {
      setCarregando(false);
    }
  }

  async function adicionar() {
    if (!valor || !descricao) return;

    try {
      const resposta = await api.post("transacoes/", {
        tipo,
        descricao,
        valor: parseFloat(valor),
        data: new Date().toISOString().split("T")[0],
        observacao,
        conta: conta?.id
      });

      setTransacoes([resposta.data, ...transacoes]);

      setValor("");
      setDescricao("");
      setObservacao("");
    } catch (err) {
      console.error("Erro completo:", err.response?.data);
      setErro("Erro ao criar transação");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza?")) return;

    try {
      await api.delete(`transacoes/${id}/`);

      setTransacoes(
        transacoes.filter((t) => t.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  }

  const entradas = transacoes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const saidas = transacoes
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const saldo = entradas - saidas;

  function formatar(valor) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  return (
    <Layout titulo="Finanças">
      {erro && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {erro}
        </div>
      )}

      <div className="cards-resumo">
        <div className="resumo-card">
          <h3>Saldo</h3>
          <p>{formatar(saldo)}</p>
        </div>

        <div className="resumo-card entrada">
          <h3>Entradas</h3>
          <p>{formatar(entradas)}</p>
        </div>

        <div className="resumo-card saida">
          <h3>Saídas</h3>
          <p>{formatar(saidas)}</p>
        </div>
      </div>

      <div className="card">
        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          type="number"
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          placeholder="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />

        <button
          onClick={adicionar}
          disabled={carregando}
        >
          {carregando ? "..." : "Adicionar"}
        </button>
      </div>

      <div className="lista">
        {transacoes.map((item) => (
          <div
            key={item.id}
            className={`item ${item.tipo}`}
          >
            <div>
              <strong>
                {item.tipo === "entrada" ? "💰" : "💸"}{" "}
                {formatar(item.valor)}
              </strong>

              <p>{item.descricao}</p>

              {item.observacao && (
                <small>{item.observacao}</small>
              )}

              <p>
                {new Date(item.data).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <button
              className="btn-excluir"
              onClick={() => excluir(item.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}