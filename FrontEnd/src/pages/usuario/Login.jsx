import "../usuario/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const resposta = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,    // 🔥 Agora usa email
          password: password
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.detail || "Email ou senha inválidos");
      }

      if (dados.access) {
        // Salva tokens
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
        <div>
          <form onSubmit={handleLogin}>
            <p id="linhaum">Bem-vindo de volta</p>
            <p id="linhadois">Entre para acessar seus módulos</p>

            {erro && <div style={{ color: 'red', marginBottom: '10px' }}>{erro}</div>}

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="inputentradas"
              placeholder="seu@email.com"
              required
            />

            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="inputentradas"
              placeholder="Sua senha"
              required
            />

            <a href="#" className="esqueceusenha">Esqueceu a senha?</a>

            <button type="submit" id="inputentradas" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>

            <p id="ou">ou</p>

            <button type="button" id="inputentradas" disabled>
              Google (em breve)
            </button>

            <div id="criar">
              <p id="naotemconta">
                Não tem uma conta?
                <a href="/usuario/cadastro"> Criar agora</a>
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