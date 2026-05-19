import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../.."/api""/api"";
import "./eventos.css";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [tipo, setTipo] = useState("pessoal");
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const resposta = await api.get("eventos/");
      setEventos((resposta.data || []).sort((a, b) =>
        new Date(a.data_inicio) - new Date(b.data_inicio)
      ));
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar eventos");
    }
  }

  async function adicionar() {
    if (!titulo.trim() || !dataInicio) return;

    try {
      const resposta = await api.post("eventos/", {
        titulo,
        descricao,
        data_inicio: dataInicio,
        data_fim: dataFim || null,
        tipo
      });

      const novosEventos = [...eventos, resposta.data].sort((a, b) =>
        new Date(a.data_inicio) - new Date(b.data_inicio)
      );
      setEventos(novosEventos);

      setTitulo("");
      setDescricao("");
      setDataInicio("");
      setDataFim("");
      setTipo("pessoal");
    } catch (err) {
      console.error(err.response?.data);
      setErro("Erro ao criar evento");
    }
  }

  async function deletar(id) {
    try {
      await api.delete(`eventos/${id}/`);
      setEventos(eventos.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Layout titulo="Eventos">
      <p className="page-sub">Planeje e organize seus compromissos</p>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-section">
          <input
            type="text"
            placeholder="Título do evento"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="input-field"
            style={{ minHeight: "80px", resize: "vertical" }}
          />
          <div className="form-row">
            <input
              type="datetime-local"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="input-field"
            />
            <input
              type="datetime-local"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="input-field"
            />
          </div>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="input-field"
          >
            <option value="pessoal">Pessoal</option>
            <option value="trabalho">Trabalho</option>
            <option value="saude">Saúde</option>
            <option value="outro">Outro</option>
          </select>
          <button onClick={adicionar} className="btn-adicionar">Adicionar Evento</button>
        </div>

        <div className="eventos-timeline">
          {eventos.length === 0 ? (
            <div className="vazio">
              <p>Nenhum evento agendado</p>
            </div>
          ) : (
            eventos.map((evento, index) => (
              <div key={evento.id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="evento-card">
                  <div className="evento-header">
                    <h3>{evento.titulo}</h3>
                    <span className={`tipo tipo-${evento.tipo}`}>
                      {evento.tipo}
                    </span>
                  </div>
                  {evento.descricao && (
                    <p className="evento-desc">{evento.descricao}</p>
                  )}
                  <div className="evento-data">
                    <span>📅 {formatarData(evento.data_inicio)}</span>
                    {evento.data_fim && (
                      <span>➜ {formatarData(evento.data_fim)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => deletar(evento.id)}
                    className="btn-delete-evento"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
    </Layout>
  );
}
