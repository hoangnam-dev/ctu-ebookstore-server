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
        ca:fs.readFileSync("C:\\ssl\\BaltimoreCyberTrustRoot.crt.pem")
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

// function readData() {
//   conn.query("SELECT * FROM directory", function (err, results, fields) {
//     if (err) throw err;
//     else console.log("Selected " + results.length + " row(s).");
//     for (i = 0; i < results.length; i++) {
//       console.log("Row: " + JSON.stringify(results[i]));
//     }
//     console.log("Done.");
//   });
// }

module.exports = conn;
