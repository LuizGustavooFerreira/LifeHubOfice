import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../../api/api";
import "./notas.css";

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const resposta = await api.get("notas/");
      setNotas(resposta.data || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar notas");
    }
  }

  async function adicionar() {
    if (!conteudo.trim()) return;

    try {
      const resposta = await api.post("notas/", {
        titulo: titulo || "Sem título",
        conteudo,
        fixada: false
      });

      setNotas([resposta.data, ...notas]);
      setTitulo("");
      setConteudo("");
    } catch (err) {
      console.error(err.response?.data);
      setErro("Erro ao criar nota");
    }
  }

  async function deletar(id) {
    try {
      await api.delete(`notas/${id}/`);
      setNotas(notas.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function fixar(id, fixada) {
    try {
      const resposta = await api.patch(`notas/${id}/`, {
        fixada: !fixada
      });
      setNotas(notas.map(n => n.id === id ? resposta.data : n));
    } catch (err) {
      console.error(err);
    }
  }

  const notasFiltradas = notas.filter(n =>
    n.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    n.conteudo.toLowerCase().includes(busca.toLowerCase())
  );

  const notasFixadas = notasFiltradas.filter(n => n.fixada);
  const notasNormais = notasFiltradas.filter(n => !n.fixada);

  return (
    <Layout>
      <div className="page-container">
        <h1>📝 Notas</h1>
        <p className="page-sub">Capture suas ideias e pensamentos</p>

        {erro && <div className="erro">{erro}</div>}

        <div className="notas-editor">
          <input
            type="text"
            placeholder="Título (opcional)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="O que você está pensando?"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="textarea-field"
            rows="5"
          />
          <div className="editor-actions">
            <button onClick={adicionar} className="btn-adicionar">
              + Adicionar Nota
            </button>
          </div>
        </div>

        <div className="busca-notas">
          <input
            type="text"
            placeholder="🔍 Buscar notas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-field"
          />
        </div>

        {notasFixadas.length > 0 && (
          <div className="notas-section">
            <h3 className="section-title">📌 Fixadas</h3>
            <div className="notas-grid">
              {notasFixadas.map((nota) => (
                <div key={nota.id} className="nota-card fixada">
                  <h3>{nota.titulo}</h3>
                  <p>{nota.conteudo.substring(0, 150)}...</p>
                  <div className="nota-actions">
                    <button
                      onClick={() => fixar(nota.id, nota.fixada)}
                      className="btn-fixar ativo"
                      title="Desafixar"
                    >
                      📌
                    </button>
                    <button
                      onClick={() => deletar(nota.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {notasNormais.length > 0 && (
          <div className="notas-section">
            <h3 className="section-title">📄 Suas Notas</h3>
            <div className="notas-grid">
              {notasNormais.map((nota) => (
                <div key={nota.id} className="nota-card">
                  <h3>{nota.titulo}</h3>
                  <p>{nota.conteudo.substring(0, 150)}...</p>
                  <div className="nota-actions">
                    <button
                      onClick={() => fixar(nota.id, nota.fixada)}
                      className="btn-fixar"
                      title="Fixar"
                    >
                      📌
                    </button>
                    <button
                      onClick={() => deletar(nota.id)}
                      className="btn-delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {notasFiltradas.length === 0 && (
          <div className="vazio">
            <p>Nenhuma nota encontrada</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
