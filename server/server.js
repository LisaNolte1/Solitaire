const express = require('express');
const path = require("path");
const cors = require('cors');
const { registerUser, login } = require('./Auth/registerHandler');
const { router } = require("./resource/resource")
require('dotenv').config({path: `./dotenv/.env.${process.env.NODE_ENV}`});

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello!' });
});

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const registrationResult = await registerUser(username, password, email);
    if (registrationResult) {
      res.status(200).json({ message: 'Registration successful' });
    } else {
      res.status(400).json({ message: 'Registration failed' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/login', async(req, res) => {
  const { username, password, email } = req.body;

  try {
    const { status, message } = await login(username, email, password)

    res.status(status).json({message: message})

  } catch(error) {
    console.log(error)
    res.status(500).json({message: "something went wrong in testing"})
  }
})

app.use("/", router);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});