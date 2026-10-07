const { Pool } = require("pg");

const pool = new Pool({
  user: "birdid_user",
  host: "localhost",
  database: "birdid",
  password: "birdid_local_password",
  port: 5432
});

module.exports = pool;