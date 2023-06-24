const mysql = require('mysql2');
require("dotenv").config();

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: "P@ssw0rd21",
        database: 'employee_tracker_db'
    },
   
);

db.on('error', (err) => {
    console.log('- STATS Mysql2 connection died:', err);
  });
  
module.exports = db;