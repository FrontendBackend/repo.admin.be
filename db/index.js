/**
 * ================================================
 * Descomentar si en caso se requiera usar postgres
 * ================================================
 */
// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "bd_administrativo",
//   password: "12345678",
//   port: 5432,
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };


// db.js
const Database = require("better-sqlite3");

// Conexión al archivo
const db = new Database("./bd_administrativo.db");

// Ejecutar queries con prepared statements
function query(sql, params = []) {
  const stmt = db.prepare(sql);
  if (sql.trim().toLowerCase().startsWith("select")) {
    return stmt.all(params); // SELECT devuelve todos los registros
  }
  return stmt.run(params); // INSERT, UPDATE, DELETE
}

module.exports = { db, query };
