import "./Index.css";
import { useNavigate } from "react-router-dom";

const usuarioId = localStorage.getItem("usuario_id");
const resposta = await fetch(`http://localhost:8000/api/MODULO/?usuario=${usuarioId}`);

const nome = localStorage.getItem("nome");

export default function Index() {

  const navigate = useNavigate(); // 🔥 faltava isso

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("nome");

    window.location.href = "/";
  }

  return (
    <div className="index-wrap">
      <header className="cabecalho">
        <nav className="nav-conteudo">
          <div className="logo-mark">L</div>
          <h1>
            <span className="metade-1">Life</span>
            <span className="metade-2">Hub</span>
          </h1>

          <button className="btn-sair" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </header>

      <main className="index-conteudo">
        <p className="index-bemvindo">Olá, bem-vindo ao LifeHub {nome}!</p>
        <p className="index-sub">O que você quer acessar hoje?</p>

        <div className="index-grid">

          <div className="index-card" onClick={() => navigate("/saude")}>
            <div className="icone">❤️</div>
            <p>Saúde</p>
          </div>

          <div className="index-card" onClick={() => navigate("/investimentos")}>
            <div className="icone">💰</div>
            <p>Investimentos</p>
          </div>

          <div className="index-card" onClick={() => navigate("/exercicios")}>
            <div className="icone">🏋️</div>
            <p>Exercícios</p>
          </div>

          <div className="index-card" onClick={() => navigate("/financas")}>
            <div className="icone">📊</div>
            <p>Finanças</p>
          </div>

          <div className="index-card" onClick={() => navigate("/habitos")}>
            <div className="icone">📅</div>
            <p>Hábitos</p>
          </div>

          <div className="index-card" onClick={() => navigate("/tarefas")}>
            <div className="icone">✅</div>
            <p>Tarefas</p>
          </div>

        </div>
      </main>
    </div>
  );
}