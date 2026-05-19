import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../.."/api""/api"";

export default function Investimentos() {
  const [investimentos, setInvestimentos] = useState([]);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [taxa, setTaxa] = useState("");
  const [tipo, setTipo] = useState("cdb");
  const [data, setData] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarInvestimentos();
  }, []);

  async function carregarInvestimentos() {
    try {
      setCarregando(true);

      const resposta = await api.get("investimentos/");

      setInvestimentos(resposta.data || []);

    } catch (err) {
      console.error("Erro ao carregar investimentos:", err);
      setErro("Erro ao carregar investimentos");
    } finally {
      setCarregando(false);
    }
  }

  async function adicionar() {
    if (!nome || !valor || !taxa) return;

    try {
      const resposta = await api.post("investimentos/", {
        nome: nome,
        tipo: tipo,
        valor_investido: parseFloat(valor),
        taxa_juros: parseFloat(taxa),
        data_investimento: data
      });

      setInvestimentos([...investimentos, resposta.data]);

      setNome("");
      setValor("");
      setTaxa("");

    } catch (err) {
      console.error("Erro completo:", err.response?.data);
      setErro("Erro ao registrar investimento");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza?")) return;

    try {
      await api.delete(`investimentos/${id}/`);

      setInvestimentos(
        investimentos.filter(i => i.id !== id)
      );

    } catch (err) {
      console.error("Erro ao excluir:", err);
      setErro("Erro ao excluir investimento");
    }
  }

  const totalInvestido = investimentos.reduce(
    (acc, i) => acc + Number(i.valor_investido),
    0
  );

  const totalRendimento = investimentos.reduce(
    (acc, i) => acc + Number(i.rendimento_estimado || 0),
    0
  );

  const patrimonioTotal =
    totalInvestido + totalRendimento;

  return (
    <Layout titulo="Investimentos">

      {erro && (
        <div style={{ color: "red", padding: "10px" }}>
          {erro}
        </div>
      )}

      <h2>
        Total investido: R$ {totalInvestido.toFixed(2)}
      </h2>

      <h3>
        Rendimento: R$ {totalRendimento.toFixed(2)}
      </h3>

      <h3>
        Patrimônio total: R$ {patrimonioTotal.toFixed(2)}
      </h3>

      <div className="card">

        <input
          placeholder="Nome (ex: CDB)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="cdb">CDB</option>
          <option value="lci">LCI</option>
          <option value="lca">LCA</option>
          <option value="tesouro">Tesouro</option>
          <option value="acoes">Ações</option>
          <option value="fundo">Fundo</option>
          <option value="cripto">Criptomoeda</option>
        </select>

        <input
          placeholder="Valor (R$)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          type="number"
        />

        <input
          placeholder="Taxa % ao ano"
          value={taxa}
          onChange={(e) => setTaxa(e.target.value)}
          type="number"
        />

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <button
          onClick={adicionar}
          disabled={carregando}
        >
          {carregando ? "..." : "Adicionar"}
        </button>
      </div>

      <div className="lista">
        {investimentos.map(i => (
          <div key={i.id} className="item">

            <div>
              <strong>
                {i.nome} ({i.tipo})
              </strong>

              <p>
                Valor investido:
                <strong>
                  {" "}
                  R$ {Number(i.valor_investido).toFixed(2)}
                </strong>
              </p>

              <p>
                Taxa:
                <strong>
                  {" "}
                  {i.taxa_juros}% a.a.
                </strong>
              </p>

              <p>
                Status:
                <strong>
                  {" "}
                  {i.ativo ? "Ativo" : "Finalizado"}
                </strong>
              </p>

              <p>
                Data:
                <strong>
                  {" "}
                  {i.data_investimento}
                </strong>
              </p>

              <p>
                Rendimento estimado:
                <strong>
                  {" "}
                  R$ {Number(i.rendimento_estimado).toFixed(2)}
                </strong>
              </p>
            </div>

            <button
              className="btn-excluir"
              onClick={() => excluir(i.id)}
            >
              Excluir
            </button>

          </div>
        ))}
      </div>

    </Layout>
  );
}