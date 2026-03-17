import { db } from "../database/connection.js";

export async function criarImovel(req, res) {
  const imagens = req.files.map(file => file.filename);

  const { titulo, descricao, preco, cidade, tipo } = req.body;

  await db.query(
    `INSERT INTO imoveis 
     (titulo, descricao, preco, cidade, tipo, imagens)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      titulo,
      descricao,
      preco,
      cidade,
      tipo,
      JSON.stringify(imagens)
    ]
  );

  res.status(201).json({ sucesso: true });
}