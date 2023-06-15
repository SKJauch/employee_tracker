const mysql = require("mysql2")

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'P@ssw0rd',
      database: 'employee_tracker_db'
    },
    console.log(`Connected to the movies_db database.`)
  );
  
  module.exports=db