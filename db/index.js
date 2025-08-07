const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bd_administrativo",
  password: "12345678",
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
