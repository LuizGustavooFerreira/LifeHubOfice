import "../usuario/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: username,      // 🔥 ÚNICA MUDANÇA (antes era username)
          password: password
        })
      });

      const dados = await resposta.json();

      if (dados.access) {
        localStorage.setItem("token", dados.access);
        navigate("/index");
      } else {
        console.log("Usuário ou senha inválidos");
      }

    } catch (erro) {
      console.error("Erro no login:", erro);
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

            <label>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="inputentradas"
              placeholder="Seu usuário"
            />

            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="inputentradas"
              placeholder="Sua senha"
            />

            <a href="#" className="esqueceusenha">Esqueceu a senha?</a>

            <button type="submit" id="inputentradas">Entrar</button>

            <p id="ou">ou</p>

            <button type="button" id="inputentradas">Google</button>

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