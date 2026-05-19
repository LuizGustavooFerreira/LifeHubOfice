import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../.."/api""/api"";
import "./saude.css";

export default function Saude() {
  const [registros, setRegistros] = useState([]);
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [meta, setMeta] = useState(localStorage.getItem("metaPeso") || "");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarRegistros();
  }, []);

  async function carregarRegistros() {
    try {
      setCarregando(true);
      const resposta = await api.get("saude/");
      setRegistros(resposta.data || []);
    } catch (err) {
      console.error("Erro ao carregar saúde:", err);
      setErro("Erro ao carregar registros");
    } finally {
      setCarregando(false);
    }
  }

  async function adicionar() {
    if (!peso || !altura) return;

    let alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);

    // Converte altura se necessário
    if (alturaNum > 3) {
      alturaNum = alturaNum / 100;
    }

    if (alturaNum <= 0 || pesoNum <= 0) return;

    try {
      const resposta = await api.post("saude/", {
        peso: pesoNum,
        altura: alturaNum,
        data_registro: data
      });

      setRegistros([...registros, resposta.data]);
      setPeso("");
    } catch (err) {
      console.error("Erro completo:", err.response?.data);
      setErro("Erro ao salvar registro");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Tem certeza?")) return;

    try {
      await api.delete(`saude/${id}/`);
      setRegistros(registros.filter(r => r.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setErro("Erro ao excluir registro");
    }
  }

  function calcularIMC(p, a) {
    if (!p || !a) return 0;
    const imc = parseFloat(p) / (parseFloat(a) * parseFloat(a));
    return imc.toFixed(1);
  }

  function classificacao(imc) {
    const valor = parseFloat(imc);

    if (valor < 18.5) return "Magro";
    if (valor < 25) return "Normal";
    if (valor < 30) return "Sobrepeso";
    return "Obesidade";
  }

  return (
    <Layout titulo="Saúde">
      {erro && <div style={{ color: 'red', padding: '10px' }}>{erro}</div>}

      <div className="card">
        <p>Meta de peso</p>
        <input
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          placeholder="Ex: 75kg"
        />
      </div>

      <div className="card">
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <input
          placeholder="Peso (kg)"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          type="number"
        />

        <input
          placeholder="Altura (m ou cm)"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          type="number"
        />

        <button onClick={adicionar} disabled={carregando}>
          {carregando ? "..." : "Registrar"}
        </button>
      </div>

      <div className="lista">
        {registros.map(r => {
          const imc = calcularIMC(r.peso, r.altura);
          return (
            <div key={r.id} className="item">
              <div>
                <strong>{r.data_registro}</strong>
                <p>Peso: {r.peso} kg</p>
                <p>Altura: {r.altura} m</p>
                <p>IMC: {imc} ({classificacao(imc)})</p>
              </div>
              <button className="btn-excluir" onClick={() => excluir(r.id)}>Excluir</button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
