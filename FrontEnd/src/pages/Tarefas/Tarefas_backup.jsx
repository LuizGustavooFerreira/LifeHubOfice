import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Tarefa.css";

export default function Tarefas() {
  const navigate = useNavigate();

  const hoje = new Date().toISOString().split("T")[0];

  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Carrega tarefas do backend
  useEffect(() => {
    carregarTarefas();
  }, []);

  async function carregarTarefas() {
    try {
      setCarregando(true);
      const resposta = await api.get("tarefas/");
      setTarefas(resposta.data || []);
      setErro("");
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
      setErro("Erro ao carregar tarefas");
    } finally {
      setCarregando(false);
    }
  }

  async function adicionar() {
    if (!titulo.trim()) return;

    try {
      const novaTarefa = {
        titulo: titulo,
        status: "pendente",
        data_vencimento: dataSelecionada,
        descricao: ""
      };

      const resposta = await api.post("tarefas/", novaTarefa);
      setTarefas([...tarefas, resposta.data]);
      setTitulo("");
      setErro("");
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
      setErro("Erro ao criar tarefa");
    }
  }

  async function toggle(id, tarefaAtual) {
    try {
      const novoStatus = tarefaAtual.status === "pendente" ? "concluida" : "pendente";
      const resposta = await api.patch(`tarefas/${id}/`, {
        status: novoStatus,
        concluida_em: novoStatus === "concluida" ? new Date().toISOString() : null
      });

      setTarefas(tarefas.map(t => t.id === id ? resposta.data : t));
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
      setErro("Erro ao atualizar tarefa");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza?")) return;

    try {
      await api.delete(`tarefas/${id}/`);
      setTarefas(tarefas.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
      setErro("Erro ao excluir tarefa");
    }
  }

  async function atualizar(id, novoTitulo) {
    if (!novoTitulo.trim()) return;

    try {
      const resposta = await api.patch(`tarefas/${id}/`, {
        titulo: novoTitulo
      });

      setTarefas(tarefas.map(t => t.id === id ? resposta.data : t));
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
      setErro("Erro ao atualizar tarefa");
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/usuario/login");
  }

  // Filtra tarefas
  const tarefasFiltradas = tarefas.filter(t => {
    // Compara datas
    const dataTarefa = t.data_vencimento || "";
    if (dataTarefa !== dataSelecionada) return false;

    // Filtra por status
    if (filtro === "ativas") return t.status === "pendente";
    if (filtro === "concluidas") return t.status === "concluida";

    return true;
  });

  return (
    <div className="tarefas-wrap">
      <header className="cabecalho">
        <nav className="nav-conteudo">
          <div className="logo-mark">L</div>
          <h1>
            <span className="metade-1">Life</span>
            <span className="metade-2">Hub</span>
          </h1>
          <div className="nav-actions">
            <button onClick={() => navigate("/index")} className="btn-voltar">
              ←
            </button>
            <button className="btn-sair" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </nav>
      </header>

      <main className="tarefas-container">
        <h1>Tarefas</h1>

        {erro && <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffeeee' }}>{erro}</div>}

        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          className="input-data"
        />

        <div className="tarefas-input">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && adicionar()}
            placeholder="Digite uma tarefa..."
          />
          <button onClick={adicionar} disabled={carregando}>
            {carregando ? "..." : "Adicionar"}
          </button>
        </div>

        <div className="tarefas-filtros">
          <button onClick={() => setFiltro("todas")}>Todas</button>
          <button onClick={() => setFiltro("ativas")}>Ativas</button>
          <button onClick={() => setFiltro("concluidas")}>Concluídas</button>
        </div>

        <div className="tarefas-lista">
          {tarefasFiltradas.map(t => (
            <div key={t.id} className="tarefa-item">
              <input
                type="checkbox"
                checked={t.status === "concluida"}
                onChange={() => toggle(t.id, t)}
              />

              <span className={t.status === "concluida" ? "concluida" : ""}>
                {t.titulo}
              </span>

              <div className="acoes">
                <button onClick={() => atualizar(t.id, prompt("Novo título:", t.titulo) || t.titulo)}>
                  ✏️
                </button>
                <button onClick={() => excluir(t.id)}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="contador">
          {tarefasFiltradas.filter(t => t.status === "pendente").length} pendentes
        </p>
      </main>
    </div>
  );
}
