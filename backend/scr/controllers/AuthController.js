import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../database/connection.js";

export async function login(req, res) {
  const { email, senha } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM usuario WHERE email = ?",
    [email]
  );

  const usuario = rows[0];
  if (!usuario) return res.status(401).json({ erro: "Login inválido" });

  const ok = await bcrypt.compare(senha, usuario.senha);
  if (!ok) return res.status(401).json({ erro: "Login inválido" });

  const token = jwt.sign(
    { id: usuario.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
}