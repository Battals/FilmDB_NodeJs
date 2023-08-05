import mysql from 'mysql2';

const createDBConnection = () => {
  const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  return db;
};

export default createDBConnection
