import { useNavigate } from "react-router-dom";

export default function Layout({ children, titulo }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="app-wrap">

      <header className="cabecalho">
        <nav className="nav-conteudo">
          <div className="logo-mark">L</div>

          <h1>
            <span className="metade-1">Life</span>
            <span className="metade-2">Hub</span>
          </h1>

          <div className="nav-actions">
            <button onClick={() => navigate("/index")}>←</button>
            <button className="btn-sair" onClick={handleLogout}>Sair</button>
          </div>
        </nav>
      </header>

      <main className="page-container">
        <h1>{titulo}</h1>
        {children}
      </main>

    </div>
  );
}