import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../../api/api";
import "./Habitos.css";

export default function Habitos() {

  const [habitos, setHabitos] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [frequencia, setFrequencia] = useState("diaria");

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const hoje = new Date()
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    carregarHabitos();
  }, []);

  async function carregarHabitos() {

    try {

      setCarregando(true);

      const [habitosRes, registrosRes] = await Promise.all([
        api.get("habitos/"),
        api.get("habitos-registros/")
      ]);

      const habitosData = habitosRes.data || [];
      const registros = registrosRes.data || [];

      const habitosAtualizados = habitosData.map(h => {

        const feitoHoje = registros.find(
          r =>
            r.habito === h.id &&
            r.data_registro === hoje &&
            r.concluido
        );

        return {
          ...h,
          concluidoHoje: !!feitoHoje
        };
      });

      setHabitos(habitosAtualizados);

    } catch (err) {

      console.error(err);

      setErro("Erro ao carregar hábitos");

    } finally {

      setCarregando(false);
    }
  }

  async function adicionar() {

    if (!nome.trim()) return;

    try {

      const resposta = await api.post("habitos/", {
        nome,
        descricao,
        frequencia
      });

      setHabitos([
        {
          ...resposta.data,
          concluidoHoje: false
        },
        ...habitos
      ]);

      setNome("");
      setDescricao("");

    } catch (err) {

      console.error(
        "Erro completo:",
        err.response?.data
      );

      setErro("Erro ao criar hábito");
    }
  }

  async function registrarHoje(habitoId) {

    const habitoAtual = habitos.find(
      h => h.id === habitoId
    );

    // evita clicar duas vezes
    if (habitoAtual?.concluidoHoje) {
      return;
    }

    try {

      await api.post("habitos-registros/", {
        habito: habitoId,
        data_registro: hoje,
        concluido: true
      });

      setHabitos(
        habitos.map(h => {

          if (h.id === habitoId) {

            return {
              ...h,
              concluidoHoje: true
            };
          }

          return h;
        })
      );

    } catch (err) {

      console.error(
        "Erro completo:",
        err.response?.data
      );

      setErro("Erro ao registrar hábito");
    }
  }

  async function excluir(id) {

    if (!window.confirm("Tem certeza?"))
      return;

    try {

      await api.delete(`habitos/${id}/`);

      setHabitos(
        habitos.filter(h => h.id !== id)
      );

    } catch (err) {

      console.error(err);

      setErro("Erro ao excluir hábito");
    }
  }

  const feitosHoje = habitos.filter(
    h => h.concluidoHoje
  ).length;

  return (
    <Layout titulo="Hábitos">

      {erro && (
        <div
          style={{
            color: "red",
            padding: "10px"
          }}
        >
          {erro}
        </div>
      )}

      <h2>
        Hábitos concluídos hoje:
        {" "}
        {feitosHoje}/{habitos.length}
      </h2>

      <div className="card">

        <input
          placeholder="Novo hábito"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
        />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) =>
            setDescricao(e.target.value)
          }
        />

        <select
          value={frequencia}
          onChange={(e) =>
            setFrequencia(e.target.value)
          }
        >
          <option value="diaria">
            Diária
          </option>

          <option value="semanal">
            Semanal
          </option>
        </select>

        <button
          onClick={adicionar}
          disabled={carregando}
        >
          {carregando
            ? "..."
            : "Adicionar"}
        </button>

      </div>

      <div className="lista">

        {habitos.map(h => {

          const feitoHoje =
            h.concluidoHoje;

          return (
            <div
              key={h.id}
              className="item"
            >

              <div>

                <strong>
                  {h.nome}
                </strong>

                {h.descricao && (
                  <p>
                    {h.descricao}
                  </p>
                )}

                <p>
                  Frequência:
                  <strong>
                    {" "}
                    {h.frequencia}
                  </strong>
                </p>

                <p className="status-pill">
                  {feitoHoje ? "Concluído hoje" : "Pendente"}
                </p>

              </div>

              <div
                className="acoes"
              >

                <button
                  className={
                    feitoHoje
                      ? "btn-feito"
                      : "btn-marcar"
                  }
                  onClick={() =>
                    registrarHoje(h.id)
                  }
                >
                  {feitoHoje
                    ? "✔ Feito"
                    : "Marcar"}
                </button>

                <button
                  className="btn-excluir"
                  onClick={() =>
                    excluir(h.id)
                  }
                >
                  Excluir
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </Layout>
  );
}