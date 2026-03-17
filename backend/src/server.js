require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { pool } = require("./db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Teste de API
app.get("/", (req, res) => res.json({ ok: true, message: "API OK!" }));

// Teste conexão banco
app.get("/teste-conexao-banco", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1+1 AS resultado");
    res.json({ ok: true, resultado: rows[0].resultado });
  } catch (err) {
    res.status(500).json({ erro: "Erro banco", detalhes: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM usuario WHERE email=?", [email]);
    if (!rows.length || rows[0].senha !== senha)
      return res.status(401).json({ erro: "Credenciais inválidas" });
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: "Erro login", detalhes: err.message });
  }
});

// Middleware token
const verificarToken = (req, res, next) => {
  const auth = req.headers.authorization?.split(" ")[1];
  if (!auth) return res.status(401).json({ erro: "Token necessário" });
  try {
    jwt.verify(auth, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ erro: "Token inválido" });
  }
};

// IMÓVEIS
app.get("/imoveis", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM imoveis");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro buscar imóveis", detalhes: err.message });
  }
});

app.post("/imoveis", verificarToken, async (req, res) => {
  try {
    const { nome, preco, cidade, bairro, estado, tipo, quartos, suites, vagas, area } = req.body;
    const [result] = await pool.query(
      "INSERT INTO imoveis (nome, preco, cidade, bairro, estado, tipo, quartos, suites, vagas, area) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nome, preco, cidade, bairro, estado, tipo, quartos, suites, vagas, area]
    );
    res.json({ sucesso: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ erro: "Erro criar imóvel", detalhes: err.message });
  }
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});