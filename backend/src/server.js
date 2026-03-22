require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("./db");
const cloudinary = require("cloudinary").v2;

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🔥 CONFIG CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// 🔥 FUNÇÃO UPLOAD
async function uploadImagem(base64) {
  const result = await cloudinary.uploader.upload(base64, {
    folder: "imoveis",
  });
  return result.secure_url;
}

// -------------------- TESTE --------------------
app.get("/", (req, res) => res.json({ ok: true }));

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE email=?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const usuario = rows[0];
    const match = await bcrypt.compare(senha, usuario.senha);

    if (!match) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// -------------------- TOKEN --------------------
function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ erro: "Token necessário" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ erro: "Token inválido" });
  }
}

// -------------------- GET IMOVEIS --------------------
app.get("/imoveis", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM imoveis");

    const normalizados = rows.map((r) => ({
      ...r,
      imagens: JSON.parse(r.imagens || "[]"),
      estrutura: JSON.parse(r.estrutura || "[]"),
    }));

    res.json(normalizados);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// -------------------- POST IMOVEIS --------------------
app.post("/imoveis", verificarToken, async (req, res) => {
  try {
    const {
      nome,
      preco,
      cidade,
      bairro,
      estado,
      tipo,
      quartos,
      suites,
      vagas,
      area,
      imagens,
      estrutura,
    } = req.body;

    // 🔥 Upload das imagens
    const urls = [];

    for (let img of imagens) {
      if (img.startsWith("http")) {
        urls.push(img);
      } else {
        const url = await uploadImagem(img);
        urls.push(url);
      }
    }

    const [result] = await pool.query(
      `INSERT INTO imoveis 
      (nome, preco, cidade, bairro, estado, tipo, quartos, suites, vagas, area, img_capa, imagens, estrutura) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        preco,
        cidade,
        bairro,
        estado,
        tipo,
        quartos,
        suites,
        vagas,
        area,
        urls[0],
        JSON.stringify(urls),
        JSON.stringify(estrutura || []),
      ]
    );

    res.json({ sucesso: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: err.message });
  }
});

// -------------------- PUT --------------------
app.put("/imoveis/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      preco,
      cidade,
      bairro,
      estado,
      tipo,
      quartos,
      suites,
      vagas,
      area,
      imagens,
      estrutura,
    } = req.body;

    const urls = [];

    for (let img of imagens) {
      if (img.startsWith("http")) {
        urls.push(img);
      } else {
        const url = await uploadImagem(img);
        urls.push(url);
      }
    }

    await pool.query(
      `UPDATE imoveis SET 
      nome=?, preco=?, cidade=?, bairro=?, estado=?, tipo=?, 
      quartos=?, suites=?, vagas=?, area=?, img_capa=?, imagens=?, estrutura=? 
      WHERE id=?`,
      [
        nome,
        preco,
        cidade,
        bairro,
        estado,
        tipo,
        quartos,
        suites,
        vagas,
        area,
        urls[0],
        JSON.stringify(urls),
        JSON.stringify(estrutura || []),
        id,
      ]
    );

    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// -------------------- DELETE --------------------
app.delete("/imoveis/:id", verificarToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM imoveis WHERE id=?", [req.params.id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando");
});