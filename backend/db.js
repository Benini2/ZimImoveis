export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT), // Garante que é um número
  ssl: {
    rejectUnauthorized: false // Importante para conexões externas com Railway/Aiven
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});