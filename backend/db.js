import mysql from 'mysql2/promise';

const dbConfig = {
  uri: import.meta.env.VITE_DATABASE_URL,
  // OU parse manual (caso prefira):
  // host: import.meta.env.VITE_DB_HOST,
  // user: import.meta.env.VITE_DB_USER,
  // password: import.meta.env.VITE_DB_PASSWORD,
  // database: import.meta.env.VITE_DB_NAME,
  // port: import.meta.env.VITE_DB_PORT,
  ssl: {
    rejectUnauthorized: false  // 🚨 OBRIGATÓRIO para Railway
  }
};

// Pool de conexões (melhor performance)
export const pool = mysql.createPool(dbConfig);

// Função de teste
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT 1 + 1 as result');
    connection.release();
    console.log('✅ Conexão OK:', rows[0]);
    return rows[0];
  } catch (error) {
    console.error('❌ Erro conexão:', error.message);
    throw error;
  }
};