database: "zim_imoveis"

import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "SUA_SENHA",
  database: "zim_imoveis"
}); 