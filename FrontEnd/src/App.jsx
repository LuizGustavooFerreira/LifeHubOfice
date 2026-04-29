import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/usuario/Login";
import Index from "./pages/Index";
import Cadastro from "./pages/usuario/cadastro";
import Exercicios from "./pages/Exercicios/Exercicios";
import Financas from "./pages/Financas/Financas";
import Habitos from "./pages/Habitos/Habitos";
import Investimentos from "./pages/Investimentos/Investimentos";
import Saude from "./pages/Saude/Saude";
import Tarefas from "./pages/Tarefas/Tarefas";
import "./pages/components/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/index" element={<Index />} />
        <Route path="/usuario/cadastro" element={<Cadastro />} />
        <Route path="/saude" element={<Saude />} />
        <Route path="/investimentos" element={<Investimentos />} />
        <Route path="/exercicios" element={<Exercicios />} />
        <Route path="/financas" element={<Financas />} />
        <Route path="/habitos" element={<Habitos />} />
        <Route path="/tarefas" element={<Tarefas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;