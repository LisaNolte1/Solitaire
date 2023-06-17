const sql = require('mssql');
require('dotenv').config({path: `./dotenv/.env.db`});

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

async function postScore(username, score) {
  const query = "INSERT INTO Score (Username, Score) VALUES (@username, @score)"

  try {
    let connection = await sql.connect(config);

    const result = await connection.request()
                                    .input("username", sql.VarChar, username)
                                    .input("score", sql.Int, score)
                                    .query(query)

    return result.rowsAffected[0] === 1;
  } catch (error) {
    console.log(error)
    throw error
  }
}


async function getUserScores(username) {
  const query = "SELECT TOP 10 Score FROM Score WHERE Username = @username ORDER BY Score Desc"

  try {
    let connection = await sql.connect(config);
    
    const result = await connection.request()
                                    .input("username", sql.VarChar, username)
                                    .query(query)

    return result.recordset
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getLeaderboard() {
    const query = "SELECT TOP 100 Username, Score FROM Score ORDER BY Score DESC"
    try {
        let connection = await sql.connect(config);
        const result = await connection.query(query);
        await sql.close();
        return result.recordset;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = { getLeaderboard, postScore, getUserScores }