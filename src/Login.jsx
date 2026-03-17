import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Header from "./components/Header";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  async function fazerLogin() {

    const res = await fetch("https://zimimoveis-production.up.railway.app/imoveis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        senha: senha
      })
    });

    const data = await res.json();

    if (data.token) {

      localStorage.setItem("token", data.token);

      navigate("/cadastroimoveis");

    } else {
      alert("Login inválido");
    }

  }

  return (
    <div className="login-page">

<Header />

      <div className="login-card">

        <h2>Painel administrativo</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

<div className="senha-container">
  <input
    type={mostrarSenha ? "text" : "password"}
    placeholder="Senha"
    value={senha}
    onChange={(e) => setSenha(e.target.value)}
  />

  <span
    className="olho"
    onClick={() => setMostrarSenha((v) => !v)}
  >
    {mostrarSenha ? <FiEyeOff /> : <FiEye />}
  </span>
</div>

        <button onClick={fazerLogin}>
          Entrar
        </button>

      </div>

      <div className="login-fundo"></div>

    </div>
  );
}