import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../../api/api";
import "./Tarefas.css";

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [data, setData] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filtro, setFiltro] = useState("todas");
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const resposta = await api.get("tarefas/");
      setTarefas(resposta.data || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar tarefas");
    }
  }

  async function adicionar() {
    if (!titulo.trim()) return;

    try {
      const resposta = await api.post("tarefas/", {
        titulo,
        descricao: "",
        prioridade,
        status: "pendente",
        data_vencimento: data
      });

      setTarefas([...tarefas, resposta.data]);

      setTitulo("");
      setPrioridade("media");
    } catch (err) {
      console.error(err.response?.data);
      setErro("Erro ao criar tarefa");
    }
  }

  async function toggle(id, tarefa) {
    try {
      const novoStatus =
        tarefa.status === "concluida"
          ? "pendente"
          : "concluida";

      await api.patch(`tarefas/${id}/`, {
        status: novoStatus
      });

      setTarefas(
        tarefas.map(t =>
          t.id === id
            ? { ...t, status: novoStatus }
            : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function excluir(id) {
    if (!window.confirm("Excluir tarefa?")) return;

    try {
      await api.delete(`tarefas/${id}/`);

      setTarefas(tarefas.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const hoje = new Date().toISOString().split("T")[0];

  const tarefasFiltradas = tarefas.filter(t => {
    if (filtro === "ativas")
      return t.status !== "concluida";

    if (filtro === "concluidas")
      return t.status === "concluida";

    if (filtro === "atrasadas")
      return (
        t.data_vencimento < hoje &&
        t.status !== "concluida"
      );

    return true;
  });

  const pendentes = tarefas.filter(
    t => t.status !== "concluida"
  ).length;

  const concluidas = tarefas.filter(
    t => t.status === "concluida"
  ).length;

  function corPrioridade(prioridade) {
    if (prioridade === "alta") return "#ef4444";
    if (prioridade === "media") return "#f59e0b";
    return "#10b981";
  }

  function corData(tarefa) {
    if (
      tarefa.data_vencimento < hoje &&
      tarefa.status !== "concluida"
    ) {
      return "#ef4444";
    }

    return "#64748b";
  }

  return (
    <Layout titulo="Tarefas">
      <div className="tarefas-container">

        <h1>Tarefas</h1>

        {erro && (
          <div className="erro">{erro}</div>
        )}

        <div className="resumo">

          <div className="card-resumo">
            <strong>{pendentes}</strong>
            <span>Pendentes</span>
          </div>

          <div className="card-resumo">
            <strong>{concluidas}</strong>
            <span>Concluídas</span>
          </div>

        </div>

        <div className="tarefas-input">

          <input
            type="date"
            value={data}
            onChange={(e) =>
              setData(e.target.value)
            }
          />

          <input
            placeholder="Digite uma tarefa..."
            value={titulo}
            onChange={(e) =>
              setTitulo(e.target.value)
            }
          />

          <select
            value={prioridade}
            onChange={(e) =>
              setPrioridade(e.target.value)
            }
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>

          <button onClick={adicionar}>
            Adicionar
          </button>

        </div>

        <div className="tarefas-filtros">

          <button
            className={filtro === "todas" ? "active" : ""}
            onClick={() => setFiltro("todas")}
          >
            Todas
          </button>

          <button
            className={filtro === "ativas" ? "active" : ""}
            onClick={() => setFiltro("ativas")}
          >
            Ativas
          </button>

          <button
            className={filtro === "concluidas" ? "active" : ""}
            onClick={() => setFiltro("concluidas")}
          >
            Concluídas
          </button>

          <button
            className={filtro === "atrasadas" ? "active" : ""}
            onClick={() => setFiltro("atrasadas")}
          >
            Atrasadas
          </button>

        </div>

        <div className="tarefas-lista">

          {tarefasFiltradas.map(t => (

            <div
              key={t.id}
              className={`item ${
                t.status === "concluida"
                  ? "tarefa-feita"
                  : ""
              }`}
            >

              <div>

                <h3>{t.titulo}</h3>

                <p
                  style={{
                    color: corData(t)
                  }}
                >
                  📅 {t.data_vencimento}
                </p>

                <p>
                  Prioridade:
                  <span
                    className="badge-prioridade"
                    style={{
                      background:
                        corPrioridade(
                          t.prioridade
                        )
                    }}
                  >
                    {t.prioridade}
                  </span>
                </p>

                <p>
                  Status:
                  {" "}
                  <strong>
                    {t.status === "concluida"
                      ? "Concluída"
                      : "Pendente"}
                  </strong>
                </p>

              </div>

              <div className="acoes">

                <button
                  className={
                    t.status === "concluida"
                      ? "btn-feito"
                      : "btn-marcar"
                  }
                  onClick={() =>
                    toggle(t.id, t)
                  }
                >
                  {t.status === "concluida"
                    ? "✓ Feita"
                    : "Marcar"}
                </button>

                <button
                  className="btn-excluir"
                  onClick={() =>
                    excluir(t.id)
                  }
                >
                  Excluir
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </Layout>
  );
}