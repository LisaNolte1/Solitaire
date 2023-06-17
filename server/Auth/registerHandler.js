const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, 
    trustServerCertificate: true,
  },
};

async function registerUser(username, password) {
    try {
      // Create a connection pool
      await sql.connect(config);
  
      // Create a new request object
      const request = new sql.Request();
  
      // Set input parameters for the stored procedure
      request.input('username', sql.NVarChar, username);
      request.input('password', sql.NVarChar, password);
  
      // Execute the stored procedure
      const result = await request.execute('InserUserProc');
  
      // Close the connection pool
      await sql.close();
  
      // Return the result
      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  module.exports = { registerUser };