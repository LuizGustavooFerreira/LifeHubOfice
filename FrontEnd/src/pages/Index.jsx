import "./index.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from ".."/api""/api"";

export default function Index() {

  const navigate = useNavigate();

  const nome = localStorage.getItem("usuario_nome");

  const [saldo, setSaldo] = useState(0);
  const [investimentos, setInvestimentos] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [habitos, setHabitos] = useState([]);
  const [habitosConcluidosHoje, setHabitosConcluidosHoje] = useState(0);
  const [projetos, setProjetos] = useState([]);
  const [notas, setNotas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [saude, setSaude] = useState(null);
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    try {

      const [
        transacoesRes,
        investimentosRes,
        tarefasRes,
        habitosRes,
        habitosRegistrosRes,
        projetosRes,
        notasRes,
        eventosRes,
        saudeRes
      ] = await Promise.all([
        api.get("transacoes/"),
        api.get("investimentos/"),
        api.get("tarefas/"),
        api.get("habitos/"),
        api.get("habitos-registros/"),
        api.get("projetos/"),
        api.get("notas/"),
        api.get("eventos/"),
        api.get("saude/")
      ]);

      setTransacoes(transacoesRes.data || []);

      // SALDO
      const saldoCalculado = transacoesRes.data.reduce((acc, item) => {
        return item.tipo === "entrada"
          ? acc + parseFloat(item.valor)
          : acc - parseFloat(item.valor);
      }, 0);

      setSaldo(saldoCalculado);

      // INVESTIMENTOS
      setInvestimentos(investimentosRes.data || []);

      // TAREFAS
      setTarefas(tarefasRes.data || []);

      // HÁBITOS
      const habitosData = habitosRes.data || [];
      setHabitos(habitosData);

      const registros = habitosRegistrosRes.data || [];
      const hoje = new Date().toISOString().split("T")[0];
      const concluidosHoje = habitosData.filter(h =>
        registros.some(
          r =>
            r.habito === h.id &&
            r.data_registro === hoje &&
            r.concluido
        )
      ).length;
      setHabitosConcluidosHoje(concluidosHoje);

      // PROJETOS
      setProjetos(projetosRes.data || []);

      // NOTAS
      setNotas(notasRes.data || []);

      // EVENTOS
      setEventos(eventosRes.data || []);

      // SAÚDE
      if (saudeRes.data.length > 0) {
        setSaude(saudeRes.data[0]);
      }

    } catch (err) {
      console.error("Erro dashboard:", err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("usuario_nome");

    window.location.href = "/";
  }

  return (
    <div className="index-wrap">

      <header className="cabecalho">
        <nav className="nav-conteudo">

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="logo-mark">L</div>

            <h1>
              <span className="metade-1">Life</span>
              <span className="metade-2">Hub</span>
            </h1>
          </div>

          <button className="btn-sair" onClick={handleLogout}>
            Sair
          </button>

        </nav>
      </header>

      <main className="index-conteudo">

        <p className="index-bemvindo">
          Olá, bem-vindo ao LifeHub {nome}!
        </p>

        <p className="index-sub">
          O que você quer acessar hoje?
        </p>

        {/* DASHBOARD */}

        <div className="dashboard">

          <div className="dashboard-cards">

            {/* SALDO */}

            <div className="dashboard-card blue">
              <div className="card-top">

                <span className="icone">💳</span>

                <div>
                  <p>Saldo atual</p>

                  <h2>
                    R$ {saldo.toFixed(2)}
                  </h2>
                </div>

              </div>

              <div className="card-footer">
                <span>
                  {transacoes.length} transações
                </span>
              </div>
            </div>

            {/* INVESTIMENTOS */}

            <div className="dashboard-card green">
              <div className="card-top">

                <span className="icone">💰</span>

                <div>
                  <p>Total investido</p>

                  <h2>
                    R$ {
                      investimentos
                        .reduce((acc, item) =>
                          acc + parseFloat(item.valor_investido || 0), 0)
                        .toFixed(2)
                    }
                  </h2>
                </div>

              </div>

              <div className="card-footer">
                <span>
                  {investimentos.length} investimentos
                </span>
              </div>
            </div>

            {/* TAREFAS */}

            <div className="dashboard-card orange">
              <div className="card-top">

                <span className="icone">📋</span>

                <div>
                  <p>Tarefas pendentes</p>

                  <h2>
                    {tarefas.filter(t => t.status !== "concluida").length}
                  </h2>
                </div>

              </div>

              <div className="card-footer">
                <span>
                  {
                    tarefas.filter(t => t.status === "concluida").length
                  } concluídas
                </span>
              </div>
            </div>

            {/* HÁBITOS */}

            <div className="dashboard-card purple">
              <div className="card-top">

                <span className="icone">✅</span>

                <div>
                  <p>Hábitos concluídos</p>

                  <h2>
                    {habitosConcluidosHoje}
                    /
                    {habitos.length}
                  </h2>
                </div>

              </div>

              <div className="card-footer">
                <span>
                  hábitos ativos
                </span>
              </div>
            </div>

            {/* PROJETOS */}

            <div className="dashboard-card teal">
              <div className="card-top">
                <span className="icone">📌</span>
                <div>
                  <p>Projetos em andamento</p>
                  <h2>
                    {projetos.filter(p => p.status !== "concluido").length}
                  </h2>
                </div>
              </div>
              <div className="card-footer">
                <span>
                  {projetos.length} projetos
                </span>
              </div>
            </div>

            {/* NOTAS */}

            <div className="dashboard-card pink">
              <div className="card-top">
                <span className="icone">📝</span>
                <div>
                  <p>Notas criadas</p>
                  <h2>{notas.length}</h2>
                </div>
              </div>
              <div className="card-footer">
                <span>
                  {notas.filter(n => n.fixada).length} fixadas
                </span>
              </div>
            </div>

            {/* EVENTOS */}

            <div className="dashboard-card cyan">
              <div className="card-top">
                <span className="icone">📅</span>
                <div>
                  <p>Eventos agendados</p>
                  <h2>{eventos.length}</h2>
                </div>
              </div>
              <div className="card-footer">
                <span>
                  {eventos.filter(e => new Date(e.data_inicio) >= new Date()).length} futuros
                </span>
              </div>
            </div>

          </div>

          {/* BOTTOM */}

          <div className="dashboard-bottom">

            {/* ATIVIDADES */}

            <div className="atividades">

              <div className="titulo-box">
                <h3>Atividades recentes</h3>
              </div>

              {transacoes.slice(0, 4).map((item) => (

                <div className="atividade-item" key={item.id}>

                  <span>
                    {item.tipo === "entrada" ? "💵" : "💸"}
                  </span>

                  <div>
                    <strong>
                      {item.descricao}
                    </strong>

                    <p>
                      R$ {parseFloat(item.valor).toFixed(2)}
                    </p>
                  </div>

                </div>

              ))}

            </div>

            {/* SAÚDE */}

            <div className="resumo-saude">

              <div className="titulo-box">
                <h3>Resumo de saúde</h3>
              </div>

              <div className="saude-grid">

                <div className="saude-card">

                  <p>Peso atual</p>

                  <h2>
                    {saude?.peso || "--"} kg
                  </h2>

                </div>

                <div className="saude-card">

                  <p>IMC atual</p>

                  <h2>
                  {saude?.imc
  ? parseFloat(saude.imc).toFixed(1)
  : "--"}
                  </h2>

                  <span>
                    Normal
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* MODULOS */}

        <div className="modules-section">
          <div>
            <p className="modules-label">Módulos</p>
            <h2 className="modules-title">Acesse seus principais recursos</h2>
          </div>
        </div>

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

          <div className="index-card" onClick={() => navigate("/projetos")}>
            <div className="icone">📌</div>
            <p>Projetos</p>
          </div>

          <div className="index-card" onClick={() => navigate("/notas")}>
            <div className="icone">📝</div>
            <p>Notas</p>
          </div>

          <div className="index-card" onClick={() => navigate("/eventos")}>
            <div className="icone">📅</div>
            <p>Eventos</p>
          </div>

        </div>

      </main>
    </div>
  );
}