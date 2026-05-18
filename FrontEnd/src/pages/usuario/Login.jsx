import "./login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("https://SEUAPP.up.railway.app/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.detail || "Email ou senha inválidos");
      }

      if (dados.access) {
        localStorage.setItem("access_token", dados.access);
        localStorage.setItem("refresh_token", dados.refresh);
        localStorage.setItem("usuario_id", dados.usuario_id);
        localStorage.setItem("usuario_nome", dados.nome);
        localStorage.setItem("usuario_email", dados.email);

        navigate("/index");
      }

    } catch (erro) {
      setErro(erro.message || "Erro no login");
      console.error("Erro:", erro);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <header className="cabecalho">
        <nav className="nav-conteudo">
          <div className="logo-mark">L</div>
          <h1>
            <span className="metade-1">Life</span>
            <span className="metade-2">Hub</span>
          </h1>
        </nav>
      </header>

      <main className="conteudo">
        <div className="auth-card">
          <form onSubmit={handleLogin}>
            <p className="auth-title">Bem-vindo de volta</p>
            <p className="auth-subtitle">Entre para acessar seus módulos</p>

            {erro && <div className="auth-msg error">{erro}</div>}

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />

            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />

            <div className="auth-footer" style={{ justifyContent: 'flex-end' }}>
              <Link to="#" className="auth-link">Esqueceu a senha?</Link>
            </div>

            <button type="submit" className="auth-button" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <p className="auth-subtitle auth-separator">ou</p>

            <button type="button" className="auth-button secondary" disabled>
              Google (em breve)
            </button>

            <div className="auth-footer">
              <p>
                Não tem uma conta? <Link to="/usuario/cadastro">Criar agora</Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      <footer className="rodape">
        <div className="modulos">
          <span className="bolinha" style={{ background: '#DC2626' }}></span> Saúde
          <span className="bolinha" style={{ background: '#16A34A' }}></span> Investimentos
          <span className="bolinha" style={{ background: '#2563EB' }}></span> Exercícios
          <span className="bolinha" style={{ background: '#D97706' }}></span> Finanças
          <span className="bolinha" style={{ background: '#7C3AED' }}></span> Hábitos
        </div>
      </footer>
    </>
  );
}