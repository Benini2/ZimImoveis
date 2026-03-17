import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { pool as db } from "../db.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

////////////////////////////////////////////////////
// TESTE API
////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API funcionando" });
});

////////////////////////////////////////////////////
// FUNÇÃO AUXILIAR
////////////////////////////////////////////////////

function safeParse(value) {
  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch {
    return [value];
  }
}

////////////////////////////////////////////////////
// 🔎 BUSCAR IMOVEIS
////////////////////////////////////////////////////

app.get("/imoveis", async (req, res) => {
  try {

    const [rows] = await db.query("SELECT * FROM imoveis");

    const imoveisFormatados = rows.map((item) => {

      let estrutura = safeParse(item.estrutura);
      let imagens = safeParse(item.imagens);

      if (Array.isArray(estrutura[0])) estrutura = estrutura[0];
      if (Array.isArray(imagens[0])) imagens = imagens[0];

      return {
        ...item,
        estrutura,
        imagens
      };

    });

    res.json(imoveisFormatados);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar imóveis" });
  }
});

////////////////////////////////////////////////////
// ➕ CRIAR IMOVEL
////////////////////////////////////////////////////

app.post("/imoveis", verificarToken, async (req, res) => {

  try {

    let {
      nome,
      preco,
      descricao,
      cidade,
      bairro,
      estado,
      tipo,
      quartos,
      suites,
      vagas,
      area,
      estrutura,
      imagens,
      img_capa
    } = req.body;

    if (preco) {
      preco = preco.toString().replace(/[^\d,.-]/g, "").replace(",", ".");
      preco = parseFloat(preco);
    }

    if (area) {
      area = area.toString().replace(/[^\d.]/g, "");
      area = parseFloat(area);
    }

    const sql = `
      INSERT INTO imoveis (
        nome, preco, descricao, cidade, bairro, estado,
        tipo, quartos, suites, vagas, area,
        estrutura, imagens, img_capa
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      nome,
      preco,
      descricao,
      cidade,
      bairro,
      estado,
      tipo,
      quartos,
      suites,
      vagas,
      area,
      JSON.stringify(estrutura || []),
      JSON.stringify(imagens || []),
      img_capa || null
    ]);

    res.json({ sucesso: true, id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao salvar imóvel" });
  }

});

////////////////////////////////////////////////////
// ✏️ EDITAR IMOVEL
////////////////////////////////////////////////////

app.put("/imoveis/:id", verificarToken, async (req, res) => {

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
    estrutura,
    imagens,
    img_capa
  } = req.body;

  try {

    await db.query(
      `
      UPDATE imoveis SET
        nome=?,
        preco=?,
        cidade=?,
        bairro=?,
        estado=?,
        tipo=?,
        quartos=?,
        suites=?,
        vagas=?,
        area=?,
        estrutura=?,
        imagens=?,
        img_capa=?
      WHERE id=?
      `,
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
        JSON.stringify(estrutura || []),
        JSON.stringify(imagens || []),
        img_capa,
        id
      ]
    );

    res.json({ sucesso: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar imóvel" });
  }

});

////////////////////////////////////////////////////
// 🗑️ DELETAR IMOVEL
////////////////////////////////////////////////////

app.delete("/imoveis/:id", verificarToken, async (req, res) => {

  const { id } = req.params;

  try {

    await db.query("DELETE FROM imoveis WHERE id = ?", [id]);

    res.json({ message: "Imóvel deletado com sucesso" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar imóvel" });
  }

});

////////////////////////////////////////////////////
// 🔐 LOGIN
////////////////////////////////////////////////////

app.post("/login", async (req, res) => {

  const { email, senha } = req.body;

  try {

    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const usuario = rows[0];

    if (usuario.senha !== senha) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no login" });
  }

});

////////////////////////////////////////////////////
// VERIFICAR TOKEN
////////////////////////////////////////////////////

function verificarToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ erro: "Token não enviado" });

  const token = authHeader.split(" ")[1];

  try {

    jwt.verify(token, process.env.JWT_SECRET);

    next();

  } catch {

    res.status(403).json({ erro: "Token inválido" });

  }

}

// Rota para testar conexão com banco
app.get("/teste-conexao-banco", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS resultado");
    res.json({ ok: true, resultado: rows[0].resultado });
  } catch (err) {
    console.error("ERRO NA CONEXÃO COM O BANCO:", err);
    res.status(500).json({ erro: "Erro na conexão com o banco", detalhes: err.message });
  }
});

////////////////////////////////////////////////////
// PORTA DO SERVIDOR
////////////////////////////////////////////////////

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando na porta", PORT);
});