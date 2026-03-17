// db.js
import mysql from "mysql2/promise";

const connectionURL = process.env.MYSQL_PUBLIC_URL;

export const pool = mysql.createPool(connectionURL);

export default pool;