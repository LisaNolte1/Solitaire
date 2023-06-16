const sql = require('mssql');
require('dotenv').config({path: `./dotenv/.env.db`});

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true // Enable encryption if needed
  }
};

async function postScore(username, score) {
  const query = "INSERT INTO Score (Username, Score) VALUE (@username, @score)"

  try {
    await sql.connect(config)

    sql.input("username", sql.VarChar, username)
    sql.input("score", sql.Int, score)
    const result = await sql.query(query)

    return result.rowsAffected[0] === 1;
  } catch (error) {
    console.log(error)
    throw error
  }
}


async function getUserScores(username) {
  const query = "SELECT Score FROM Score WHERE Username = @username ORDER BY Score Desc LIMIT 10"

  try {
    await sql.connect(config)

    sql.input("username", sql.VarChar, username)
    const result = await sql.query(query)
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getLeaderboard() {
  console.log(config)
    const query = "SELECT Username, Score FROM Score ORDER BY Score DESC LIMIT 100"
    try {
        await sql.connect(config);
        console.log("HERE")
        const request = sql.Request();
        const result = request.query(query);

        await sql.close();
        console.log(result)
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = { getLeaderboard, postScore, getUserScores }