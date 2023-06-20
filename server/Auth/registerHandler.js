const sql = require('mssql');
const { randomBytes, createHash } = require('crypto')
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

function hashPassword(password, salt) {
    return salt + sha256(password + salt)
}

function sha256(str) {
    return createHash('sha256').update(str).digest('hex')
}

function generateSalt() {
  return randomBytes(16).toString('base64');
}

async function registerUser(username, password, email) {
    try {
      // Create a connection pool
      const connection = await sql.connect(config);
      const salt = generateSalt();
      const hashedPassword = hashPassword(password, salt);
      // Create a new request object
      const result = await connection.request()
                                      .input('username', sql.VarChar, username)
                                      .input('hashedPassword', sql.VarChar, hashedPassword)
                                      .input('email', sql.VarChar, email)
                                      .input('salt', sql.VarChar, salt)
                                      .execute('InsertUser');
  
      // Close the connection pool
      await connection.close();
  
      // Return the result
      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
}

async function login(username, email, password) {
  if (username === undefined) {
    return loginUserWithEmail(email, password)
  } else {
    return loginUserWithUsername(username, password)
  }
}

async function loginUserWithUsername(username, password) {
    const getUserID = 'SELECT p.UserID, p.Salt FROM [User] u JOIN [Password] p ON p.UserID = u.UserID  WHERE u.Username = @username'
    try {
        const connection = await sql.connect(config);

        const result = await connection.request()
                                        .input('username', sql.VarChar, username)
                                        .query(getUserID)
        
        connection.close();                                
        if (result.recordset.length === 0) {
          return { status: 404, message: 'No user with that username or password' }
        }
        const { UserID: userId, Salt: salt } = result.recordset[0]
        if (await loginUser(userId, password, salt, connection)) {
          return { status: 200, message: 'Success' }
        } else {
          return { status: 404, message: 'No user with that username or password' }
        }
        
    } catch (error) {
      console.log("ERROR THROW")
      throw error
    }
}

async function loginUserWithEmail(email, password) {
  const getUserID = 'SELECT p.UserID, p.Salt FROM [User] u JOIN [Password] p ON p.UserID = u.UserID  WHERE u.Email = @email'
    try {
        const connection = await sql.connect(config);

        const result = await connection.request()
                                        .input('email', sql.VarChar, email)
                                        .query(getUserID)
        
        connection.close();                   
        if (result.recordset.length === 0) {
          return { status: 404, message: 'No user with that email or password' }
        }
        const { UserID: userId, Salt: salt } = result.recordset[0]
        if (await loginUser(userId, password, salt, connection)) {
          return { status: 200, message: 'Success' }
        } else {
          return { status: 404, message: 'No user with that email or password' }
        }
        
    } catch (error) {
      console.log("ERROR THROW")
      throw error
    }
}

async function loginUser(userId, password, salt) {
    const hashedPassword = hashPassword(password, salt)
    const query = 'SELECT UserID FROM [Password] WHERE UserID = @userId AND HashedPassword = @hashedPassword'
    try {
        const connection = await sql.connect(config);
        const result = await connection.request()
                                    .input('userId', sql.Int, userId)
                                    .input('hashedPassword', sql.VarChar, hashedPassword)
                                    .query(query)
        connection.close()
        if (result.recordset.length === 0) {
          return false
        } else {
          const { UserID: returnedUserId } = result.recordset[0]
          return returnedUserId === userId
        }
    } catch (error) {
      throw error;
    }
}

  module.exports = { registerUser, login };