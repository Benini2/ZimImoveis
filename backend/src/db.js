// src/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const connectionURL = process.env.MYSQL_PUBLIC_URL;
if (!connectionURL) throw new Error("⚠️ Variável MYSQL_PUBLIC_URL não definida!");

const url = new URL(connectionURL);

const pool = mysql.createPool({
  host: url.hostname,
  port: parseInt(url.port),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false },
  connectTimeout: 10000
});

pool.getConnection()
  .then(() => console.log("✅ Conectado ao MySQL!"))
  .catch(err => console.error("❌ Erro ao conectar ao MySQL:", err.message));

module.exports = { pool };