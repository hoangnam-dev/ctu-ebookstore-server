const mysql = require("mysql");
const fs = require("fs");
require('dotenv').config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    ssl:{
        ca:fs.readFileSync(process.env.DB_CA_PATH)
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});

conn.connect(function (err) {
  if (err) {
    console.log("!!! Cannot connect !!! Error:");
    throw err;
  } else {
    console.log("Connection established.");
  }
});

module.exports = conn;
