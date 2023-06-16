const express = require('express');
const path = require('path');
require('dotenv').config({path: `./dotenv/.env.${process.env.NODE_ENV}`});

const app = express();
const port = process.env.WEB_PORT;

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'login', 'login.html');
  res.sendFile(filePath);
});

app.get('/register', (req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'register', 'register.html');
  res.sendFile(filePath);
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});