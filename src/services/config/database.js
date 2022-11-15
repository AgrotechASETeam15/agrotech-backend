const mariaDB = require('mariadb');

let pool;

async function getConnection() {
  if (!pool) {
    pool = mariaDB.createPool({
      host: process.env.DB_HOST || 'host.docker.internal',
      // host: process.env.DB_HOST || 'p-q.h.filess.io',
      // user: process.env.DB_USER || 'mariadb_gasolinedo',
      user: process.env.DB_USER || 'root',
      // password:
      //   process.env.DB_PASSWORD || 'fdce3c0e3cefd4e85e5a83b98508452312f4a30e',
      password: process.env.DB_PASSWORD || 'password',
      // database: process.env.DB_NAME || 'mariadb_gasolinedo',
      database: process.env.DB_NAME || 'agrotech',
      //
      // port: process.env.DB_PORT || 3305,
      // connectionLimit: 10,
      dateStrings: true,
      decimalAsNumber: false,
    });
  }
  const connection = await pool.getConnection();
  return connection;
}

module.exports = getConnection;
