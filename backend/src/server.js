require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("./db");

const app = express();

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==================== UTILITÁRIOS ====================
const normalizeImovel = (imovel) => {
  let imagens = [];
  let estrutura = [];

  try {
    imagens = JSON.parse(imovel.imagens || "[]");
  } catch {
    imagens = typeof imovel.imagens === "string" ? [imovel.imagens] : [];
  }

  try {
    estrutura = JSON.parse(imovel.estrutura || "[]");
  } catch {
    estrutura = typeof imovel.estrutura === "string" ? [imovel.estrutura] : [];
  }

  return {
    ...imovel,
    imagens,
    estrutura
  };
};

// ==================== MIDDLEWARE DE AUTENTICAÇÃO ====================
const verificarToken = (req, res, next) => {
  const auth = req.headers.authorization?.split(" ")[1];
  
  if (!auth) {
    return res.status(401).json({ erro: "Token necessário" });
  }

  try {
    jwt.verify(auth, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ erro: "Token inválido" });
  }
};

// ==================== ROTAS DE TESTE ====================
app.get("/api", (req, res) => {
  res.json({ ok: true, message: "API OK!" });
});

app.get("/api/teste-conexao-banco", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1+1 AS resultado");
    res.json({ ok: true, resultado: rows[0].resultado });
  } catch (err) {
    res.status(500).json({ erro: "Erro banco", detalhes: err.message });
  }
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM usuario WHERE email=?", [email]);
    
    if (!rows.length) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const usuario = rows[0];
    const match = await bcrypt.compare(senha, usuario.senha);

    if (!match) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { 
      expiresIn: "8h" 
    });
    
    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: "Erro login", detalhes: err.message });
  }
});

// ==================== ROTAS DE IMÓVEIS ====================
app.get("/api/imoveis", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM imoveis");
    const normalizados = rows.map(normalizeImovel);
    res.json(normalizados);
  } catch (err) {
    res.status(500).json({ erro: "Erro buscar imóveis", detalhes: err.message });
  }
});

app.post("/api/imoveis", verificarToken, async (req, res) => {
  try {
    const { 
      nome, preco, cidade, bairro, estado, tipo, 
      quartos, suites, vagas, area, imagens, estrutura 
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO imoveis 
       (nome, preco, cidade, bairro, estado, tipo, quartos, suites, vagas, area, 
        img_capa, imagens, estrutura) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome, preco, cidade, bairro, estado, tipo, quartos, suites, vagas, area,
        imagens?.[0] || null,
        JSON.stringify(imagens || []),
        JSON.stringify(estrutura || [])
      ]
    );

    res.json({ sucesso: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ erro: "Erro criar imóvel", detalhes: err.message });
  }
});

app.put("/api/imoveis/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nome, preco, cidade, bairro, estado, tipo, 
      quartos, suites, vagas, area, imagens, estrutura 
    } = req.body;

    await pool.query(
      `UPDATE imoveis SET 
       nome=?, preco=?, cidade=?, bairro=?, estado=?, tipo=?, 
       quartos=?, suites=?, vagas=?, area=?, img_capa=?, imagens=?, estrutura=? 
       WHERE id=?`,
      [
        nome, preco, cidade, bairro, estado, tipo, quartos, suites, vagas, area,
        imagens?.[0] || null,
        JSON.stringify(imagens || []),
        JSON.stringify(estrutura || []),
        id
      ]
    );

    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro atualizar imóvel", detalhes: err.message });
  }
});

app.delete("/api/imoveis/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM imoveis WHERE id=?", [id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro deletar imóvel", detalhes: err.message });
  }
});

// ==================== 404 HANDLER ====================
app.use('*', (req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// ==================== INICIALIZAÇÃO DO SERVIDOR ====================
const PORT = process.env.PORT || 8800;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});