const mysql = require("mysql2/promise");
require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Cb102030*", // ⚠️ coloca a senha do seu MySQL
  database: "Zim_imoveis", // ⚠️ nome do seu banco
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(() => console.log("✅ Conectado ao MySQL local!"))
  .catch(err => console.error("❌ Erro ao conectar:", err.message));

module.exports = { pool };

pool.getConnection()
  .then(() => console.log("✅ Conectado ao MySQL!"))
  .catch(err => console.error("❌ Erro ao conectar ao MySQL:", err.message));

module.exports = { pool };