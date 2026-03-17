// src/routes/imoveis.routes.js
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { criarImovel } from "../controllers/ImoveisController.js";

const router = Router();

router.post(
  "/imoveis",
  auth,
  upload.array("imagens"),
  criarImovel
);

router.get("/imoveis", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM imoveis");
  res.json(rows);
});

export default router;