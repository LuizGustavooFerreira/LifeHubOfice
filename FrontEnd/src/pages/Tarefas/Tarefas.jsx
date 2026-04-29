import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tarefa.css";

export default function Tarefas() {
  const navigate = useNavigate();

  const hoje = new Date().toISOString().split("T")[0];

  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [editandoId, setEditandoId] = useState(null);
  const [editTexto, setEditTexto] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(hoje);

  function adicionar() {
    if (!texto.trim()) return;

    setTarefas([
      ...tarefas,
      {
        id: Date.now(),
        texto,
        concluida: false,
        data: dataSelecionada
      }
    ]);

    setTexto("");
  }

  function toggle(id) {
    setTarefas(tarefas.map(t =>
      t.id === id ? { ...t, concluida: !t.concluida } : t
    ));
  }

  function excluir(id) {
    setTarefas(tarefas.filter(t => t.id !== id));
  }

  function iniciarEdicao(t) {
    setEditandoId(t.id);
    setEditTexto(t.texto);
  }

  function salvarEdicao(id) {
    setTarefas(tarefas.map(t =>
      t.id === id ? { ...t, texto: editTexto } : t
    ));
    setEditandoId(null);
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  const tarefasFiltradas = tarefas.filter(t => {
    if (t.data !== dataSelecionada) return false;

    if (filtro === "ativas") return !t.concluida;
    if (filtro === "concluidas") return t.concluida;

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

        {/* DATA */}
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          className="input-data"
        />

        {/* INPUT */}
        <div className="tarefas-input">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Digite uma tarefa..."
          />
          <button onClick={adicionar}>Adicionar</button>
        </div>

        {/* FILTROS */}
        <div className="tarefas-filtros">
          <button onClick={() => setFiltro("todas")}>Todas</button>
          <button onClick={() => setFiltro("ativas")}>Ativas</button>
          <button onClick={() => setFiltro("concluidas")}>Concluídas</button>
        </div>

        {/* LISTA */}
        <div className="tarefas-lista">
          {tarefasFiltradas.map(t => (
            <div key={t.id} className="tarefa-item">

              <input
                type="checkbox"
                checked={t.concluida}
                onChange={() => toggle(t.id)}
              />

              {editandoId === t.id ? (
                <input
                  value={editTexto}
                  onChange={(e) => setEditTexto(e.target.value)}
                />
              ) : (
                <span className={t.concluida ? "concluida" : ""}>
                  {t.texto}
                </span>
              )}

              <div className="acoes">
                {editandoId === t.id ? (
                  <button onClick={() => salvarEdicao(t.id)}>✔</button>
                ) : (
                  <button onClick={() => iniciarEdicao(t)}>✏️</button>
                )}

                <button onClick={() => excluir(t.id)}>🗑</button>
              </div>

            </div>
          ))}
        </div>

        <p className="contador">
          {tarefasFiltradas.filter(t => !t.concluida).length} pendentes
        </p>

      </main>
    </div>
  );
}