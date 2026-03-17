// src/teste-db-avancado.js
require("dotenv").config();
const mysql = require("mysql2/promise");

(async () => {
  console.log("🔹 Teste de variáveis de ambiente");

  const connectionURL = process.env.MYSQL_PUBLIC_URL;
  if (!connectionURL) {
    console.error("❌ Variável MYSQL_PUBLIC_URL não definida!");
    process.exit(1);
  }
  console.log("✅ MYSQL_PUBLIC_URL encontrada:", connectionURL);

  let url;
  try {
    url = new URL(connectionURL);
    console.log("✅ URL parseada corretamente:");
    console.log("  Host:", url.hostname);
    console.log("  Porta:", url.port);
    console.log("  Usuário:", url.username);
    console.log("  Database:", url.pathname.slice(1));
  } catch (err) {
    console.error("❌ Erro ao parsear URL:", err.message);
    process.exit(1);
  }

  console.log("\n🔹 Testando conexão direta com MySQL");

  try {
    const conn = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
      connectTimeout: 10000
    });
    console.log("✅ Conexão estabelecida com sucesso!");
    
    const [rows] = await conn.query("SELECT 1+1 AS resultado");
    console.log("✅ Query teste executada, resultado:", rows[0].resultado);

    await conn.end();
  } catch (err) {
    console.error("❌ Erro de conexão com MySQL:");
    console.error("  Nome do erro:", err.code || err.name);
    console.error("  Mensagem:", err.message);
    console.error("  Stack:", err.stack.split("\n")[0]);
  }
})();