import "./cadastro.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Cadastro() {
     const navigate = useNavigate()
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
                    <form action="">
                        <p id="linhaum">Crie sua conta aqui!</p>
                        <p id="linhadois">Começe sua experiencia agora</p>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="inputentradas" placeholder="SeuEmail@" />
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="inputentradas" placeholder="SeuEmail@" />
                        <button type="submit" id="inputentradas">Criar</button>
                        <button onClick={() => navigate('/')} id="inputentradas">Voltar</button>
                    </form>
                </div>
            </main>
            <div className="rodape">
                <footer className="rodape">
                    <div className="modulos">
                        <span className="bolinha" style={{ background: '#DC2626' }}></span> Saúde
                        <span className="bolinha" style={{ background: '#16A34A' }}></span> Investimentos
                        <span className="bolinha" style={{ background: '#2563EB' }}></span> Exercícios
                        <span className="bolinha" style={{ background: '#D97706' }}></span> Finanças
                        <span className="bolinha" style={{ background: '#7C3AED' }}></span> Hábitos
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Cadastro;