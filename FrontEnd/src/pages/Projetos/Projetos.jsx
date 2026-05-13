import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../../api/api";
import "./projetos.css";

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const resposta = await api.get("projetos/");
      setProjetos(resposta.data || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar projetos");
    }
  }

  async function adicionar() {
    if (!titulo.trim()) return;

    try {
      const resposta = await api.post("projetos/", {
        titulo,
        descricao,
        status: "pendente",
        progresso: 0
      });

      setProjetos([...projetos, resposta.data]);
      setTitulo("");
      setDescricao("");
    } catch (err) {
      console.error(err.response?.data);
      setErro("Erro ao criar projeto");
    }
  }

  async function deletar(id) {
    try {
      await api.delete(`projetos/${id}/`);
      setProjetos(projetos.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function atualizar(id, novoStatus) {
    try {
      const resposta = await api.patch(`projetos/${id}/`, {
        status: novoStatus
      });
      setProjetos(projetos.map(p => p.id === id ? resposta.data : p));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Layout>
      <div className="page-container">
        <h1>📌 Projetos</h1>
        <p className="page-sub">Organize e acompanhe seus projetos</p>

        {erro && <div className="erro">{erro}</div>}

        <div className="form-section">
          <input
            type="text"
            placeholder="Título do projeto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="input-field"
          />
          <button onClick={adicionar} className="btn-adicionar">Adicionar Projeto</button>
        </div>

        <div className="projetos-grid">
          {projetos.map((projeto) => (
            <div key={projeto.id} className="projeto-card">
              <div className="projeto-header">
                <h3>{projeto.titulo}</h3>
                <span className={`status status-${projeto.status}`}>
                  {projeto.status}
                </span>
              </div>
              {projeto.descricao && <p className="projeto-desc">{projeto.descricao}</p>}
              <div className="projeto-footer">
                <div className="progresso-bar">
                  <div 
                    className="progresso-fill" 
                    style={{width: `${projeto.progresso}%`}}
                  />
                </div>
                <span className="progresso-text">{projeto.progresso}%</span>
              </div>
              <div className="projeto-actions">
                <select 
                  value={projeto.status}
                  onChange={(e) => atualizar(projeto.id, e.target.value)}
                  className="select-status"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_progresso">Em Progresso</option>
                  <option value="concluido">Concluído</option>
                </select>
                <button 
                  onClick={() => deletar(projeto.id)}
                  className="btn-delete"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
