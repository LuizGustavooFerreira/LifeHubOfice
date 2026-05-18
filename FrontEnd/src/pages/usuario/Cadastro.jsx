import "./login.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Cadastro() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [nome, setNome] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  async function handleCadastro(e) {
    e.preventDefault()
    setErro("")
    setSucesso(false)

    if (!email || !nome || !password || !confirmPassword) {
      setErro("Todos os campos são obrigatórios")
      return
    }

    if (password !== confirmPassword) {
      setErro("As senhas não correspondem")
      return
    }

    if (password.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres")
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch("localhost:8000/api/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          nome: nome,
          password: password
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        if (dados.email) {
          throw new Error(dados.email[0] || "Email já cadastrado")
        }
        throw new Error(dados.detail || "Erro ao criar conta")
      }

      setSucesso(true)
      setEmail("")
      setNome("")
      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        navigate("/usuario/login")
      }, 2000)

    } catch (erro) {
      setErro(erro.message || "Erro ao criar conta")
      console.error("Erro:", erro)
    } finally {
      setCarregando(false)
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
          <form onSubmit={handleCadastro}>
            <p className="auth-title">Crie sua conta aqui!</p>
            <p className="auth-subtitle">Comece sua experiência agora</p>

            {erro && <div className="auth-msg error">{erro}</div>}
            {sucesso && <div className="auth-msg success">✓ Conta criada! Redirecionando para login...</div>}

            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              className="auth-input"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="auth-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="Crie uma senha segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              className="auth-input"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="auth-button" disabled={carregando}>
              {carregando ? "Criando conta..." : "Criar"}
            </button>

            <button
              type="button"
              className="auth-button secondary"
              onClick={() => navigate("/usuario/login")}
              disabled={carregando}
            >
              Voltar
            </button>
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
  )
}

export default Cadastro;