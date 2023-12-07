const mysql = require('mysql2/promise');

const createConnection = async () => {
  const connection = await mysql.createConnection({
    host: '34.101.143.217',
    user: 'root',
    database: 'batinco',
    password: 'batin1234co'
  });

  return connection;
};

module.exports = { createConnection };
