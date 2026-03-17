require("dotenv").config();
const mysql = require("mysql2/promise");

(async () => {
  const url = new URL(process.env.MYSQL_PUBLIC_URL);
  const pool = mysql.createPool({
    host: url.hostname,
    port: parseInt(url.port),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { mode: "required" },
    connectTimeout: 10000
  });

  try {
    const [rows] = await pool.query("SELECT 1+1 AS resultado");
    console.log("✅ Conexão OK, resultado:", rows[0].resultado);
  } catch (err) {
    console.error("❌ Erro conexão:", err.message);
  }
})();