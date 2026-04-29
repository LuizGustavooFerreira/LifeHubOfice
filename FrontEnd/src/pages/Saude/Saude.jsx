import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "./Saude.css";

export default function Saude() {

  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [meta, setMeta] = useState("");
  const [historico, setHistorico] = useState([]);
  const [data, setData] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("saude")) || [];
    setHistorico(dados);
  }, []);

  useEffect(() => {
    localStorage.setItem("saude", JSON.stringify(historico));
  }, [historico]);

  function adicionar() {
    if (!peso || !altura) return;

    let alturaNum = Number(altura);
    const pesoNum = Number(peso);

    // 🔥 CORREÇÃO PRINCIPAL
    if (alturaNum > 3) {
      alturaNum = alturaNum / 100; // 180 -> 1.80
    }

    if (alturaNum <= 0 || pesoNum <= 0) return;

    setHistorico([
      ...historico,
      {
        id: Date.now(),
        peso: pesoNum,
        altura: alturaNum,
        data
      }
    ]);

    setPeso("");
  }

  function excluir(id) {
    setHistorico(historico.filter(h => h.id !== id));
  }

  function calcularIMC(p, a) {
    const imc = p / (a * a);
    return imc.toFixed(1);
  }

  function classificacao(imc) {
    const valor = Number(imc);

    if (valor < 18.5) return "Magro";
    if (valor < 25) return "Normal";
    if (valor < 30) return "Sobrepeso";
    return "Obesidade";
  }

  return (
    <Layout titulo="Saúde">

      {/* META */}
      <div className="card">
        <p>Meta de peso</p>
        <input
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          placeholder="Ex: 75kg"
        />
      </div>

      {/* INPUT */}
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
        />

        <input
          placeholder="Altura (m ou cm)"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
        />

        <button onClick={adicionar}>Registrar</button>
      </div>

      {/* HISTÓRICO */}
      <div className="lista">
        {historico.map(h => {
          const imc = calcularIMC(h.peso, h.altura);

          return (
            <div key={h.id} className="item">

              <div>
                <strong>{h.peso}kg</strong> - {h.data}
                <p>
                  IMC: {imc} ({classificacao(imc)})
                </p>
              </div>

              <button onClick={() => excluir(h.id)}>🗑</button>

            </div>
          );
        })}
      </div>

    </Layout>
  );
}