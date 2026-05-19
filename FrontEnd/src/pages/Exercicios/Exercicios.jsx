import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../../api/api";

export default function Exercicios() {

  const [exercicios, setExercicios] = useState([]);
  const [nome, setNome] = useState("");
  const [tempo, setTempo] = useState("");
  const [intensidade, setIntensidade] = useState("moderada");

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarExercicios();
  }, []);

  async function carregarExercicios() {
    try {

      setCarregando(true);

      const resposta = await api.get("exercicios/");

      setExercicios(resposta.data || []);

    } catch (err) {

      console.error("Erro ao carregar exercícios:", err);

      setErro("Erro ao carregar exercícios");

    } finally {
      setCarregando(false);
    }
  }

  async function adicionar() {

    if (!nome || !tempo) return;

    try {

      const resposta = await api.post("exercicios/", {
        nome: nome,
        tempo_minutos: parseInt(tempo),
        intensidade: intensidade,
        data_registro: new Date().toISOString().split("T")[0]
      });

      setExercicios([...exercicios, resposta.data]);

      setNome("");
      setTempo("");

    } catch (err) {

      console.error("Erro completo:", err.response?.data);

      setErro("Erro ao registrar exercício");
    }
  }

  async function excluir(id) {

    if (!window.confirm("Tem certeza?")) return;

    try {

      await api.delete(`exercicios/${id}/`);

      setExercicios(
        exercicios.filter(e => e.id !== id)
      );

    } catch (err) {

      console.error("Erro ao excluir:", err);

      setErro("Erro ao excluir exercício");
    }
  }

  function calorias(exercicio) {

    const fator = {
      leve: 4,
      moderada: 7,
      intensa: 10
    };

    return (
      exercicio.tempo_minutos *
      fator[exercicio.intensidade]
    );
  }

  const totalMinutos = exercicios.reduce(
    (acc, e) => acc + Number(e.tempo_minutos),
    0
  );

  const totalCalorias = exercicios.reduce(
    (acc, e) => acc + calorias(e),
    0
  );

  return (
    <Layout titulo="Exercícios">

      {erro && (
        <div style={{ color: "red", padding: "10px" }}>
          {erro}
        </div>
      )}

      <h2>
        Tempo total treinado:
        {" "}
        {totalMinutos} min
      </h2>

      <h3>
        Calorias estimadas:
        {" "}
        {totalCalorias} kcal
      </h3>

      <div className="card">

        <input
          placeholder="Exercício"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Tempo (min)"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
          type="number"
        />

        <select
          value={intensidade}
          onChange={(e) =>
            setIntensidade(e.target.value)
          }
        >
          <option value="leve">Leve</option>
          <option value="moderada">Moderada</option>
          <option value="intensa">Intensa</option>
        </select>

        <button
          onClick={adicionar}
          disabled={carregando}
        >
          {carregando ? "..." : "Registrar"}
        </button>

      </div>

      <div className="lista">

        {exercicios.map(e => (

          <div key={e.id} className="item">

            <div>

              <strong>{e.nome}</strong>

              <p>
                Tempo:
                <strong>
                  {" "}
                  {e.tempo_minutos} min
                </strong>
              </p>

              <p>
                Intensidade:
                <strong>
                  {" "}
                  {e.intensidade}
                </strong>
              </p>

              <p>
                Data:
                <strong>
                  {" "}
                  {e.data_registro}
                </strong>
              </p>

              <p>
                Calorias estimadas:
                <strong>
                  {" "}
                  {calorias(e)} kcal
                </strong>
              </p>

            </div>

            <button
              className="btn-excluir"
              onClick={() => excluir(e.id)}
            >
              Excluir
            </button>

          </div>
        ))}

      </div>

    </Layout>
  );
}