require("dotenv").config();
const mysql = require("mysql2/promise");

async function test() {
  const connectionURL = process.env.MYSQL_PUBLIC_URL;
  const url = new URL(connectionURL);

  const pool = mysql.createPool({
    host: url.hostname,
    port: parseInt(url.port),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    connectionLimit: 5,
    ssl: { rejectUnauthorized: false } // ou mode: "required"
  });

  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS resultado");
    console.log("✅ Conexão OK, resultado:", rows[0].resultado);
  } catch (err) {
    console.error("❌ Erro conexão:", err.message);
  }
}

test();