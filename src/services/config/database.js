const mariaDB = require('mariadb');

let pool;

async function getConnection() {
  if (!pool) {
    pool = mariaDB.createPool({
      host: process.env.DB_HOST || 'maria_db',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'agrotech',
      connectionLimit: 10,
      dateStrings: true,
      decimalAsNumber: false,
    });
  }
  const connection = await pool.getConnection();
  return connection;
}

module.exports = getConnection;

// Host: `0.0.0.0`
// User: `root`
// Password: `password`
// Port: `8081`
// ```
