import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../../api/api";

export default function Habitos() {
  const [habitos, setHabitos] = useState([]);
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const hoje = new Date().toISOString().split("T")[0];

  useEffect(() => {
    carregarHabitos();
  }, []);

  async function carregarHabitos() {
    try {
      setCarregando(true);
      const resposta = await api.get("habitos/");
      setHabitos(resposta.data || []);
    } catch (err) {
      console.error("Erro ao carregar hábitos:", err);
      setErro("Erro ao carregar hábitos");
    } finally {
      setCarregando(false);
    }
  }

  async function adicionar() {
    if (!nome.trim()) return;

    try {
      const resposta = await api.post("habitos/", {
        nome: nome,
        descricao: "",
        frequencia: "diaria"
      });
      setHabitos([...habitos, resposta.data]);
      setNome("");
    } catch (err) {
      console.error("Erro ao criar hábito:", err);
      setErro("Erro ao criar hábito");
    }
  }

  async function registrarHoje(habitoId) {
    try {
      const resposta = await api.post("habitos-registros/", {
        habito: habitoId,
        data_registro: hoje,
        concluido: true
      });

      // Atualiza a UI
      setHabitos(habitos.map(h => {
        if (h.id === habitoId) {
          return { ...h, ultima_conclusao: hoje };
        }
        return h;
      }));
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setErro("Erro ao registrar hábito");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza?")) return;

    try {
      await api.delete(`habitos/${id}/`);
      setHabitos(habitos.filter(h => h.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setErro("Erro ao excluir hábito");
    }
  }

  return (
    <Layout titulo="Hábitos">
      {erro && <div style={{ color: 'red', padding: '10px' }}>{erro}</div>}

      <div className="card">
        <input
          placeholder="Novo hábito"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button onClick={adicionar} disabled={carregando}>
          {carregando ? "..." : "Adicionar"}
        </button>
      </div>

      <div className="lista">
        {habitos.map(h => (
          <div key={h.id} className="item">
            <span>{h.nome}</span>

            <button onClick={() => registrarHoje(h.id)}>
              {h.ultima_conclusao === hoje ? "✔️" : "⬜"}
            </button>

            <button onClick={() => excluir(h.id)}>🗑</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
