const http = require("http");
const path = require("path");
const fs = require("fs");

require('dotenv').config({path: `./dotenv/.env.${process.env.NODE_ENV}`});

const port = process.env.WEB_PORT;

const processUrl = (url) => {
  const urlArray = url.split('?');
  return {
    url: urlArray[0],
  };
}

const requestListener = async function (req, res) {
  const { url  } = processUrl(req.url);

  if (req.method === "GET" && (url.startsWith("/public"))) {
    serveStaticFile(res, url);
    return; 
  }
  switch (url) {
    case '/':
      fs.readFile(__dirname + '/public/login/login.html', (err, contents) => {
        if (err) {
          res.writeHead(500);
          res.end(err);
        } else {
          res.setHeader("Content-Type", "text/html");
          res.writeHead(200);
          res.end(contents);
        }
      });
      break;
    case '/register':
      fs.readFile(__dirname + '/public/register/register.html', (err, contents) => {
        if (err) {
          res.writeHead(500);
          res.end(err);
        } else {
          res.setHeader("Content-Type", "text/html");
          res.writeHead(200);
          res.end(contents);
        }
      });
    break;
    case '/solitaire':
      fs.readFile(__dirname + '/public/solitaire/solitaire.html', (err, contents) => {
        if (err) {
          res.writeHead(500);
          res.end(err);
        } else {
          res.setHeader("Content-Type", "text/html");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.writeHead(200);
          res.end(contents);
        }
      });
    break;
    default:
      res.writeHead(404);
      res.end(JSON.stringify({error:"Resource not found"}));
  }
};

const server = http.createServer(requestListener);
server.listen(port, () => {
    console.log(`${process.env.SERVER_NAME} Web Server started at http://localhost:${port}`);
});

function serveStaticFile(res, url)  { 
  const filePath = path.join(__dirname, url);
  const contentType = getContentType(filePath); 
  fs.readFile(filePath, (err, data) => { 
    if (err) {
      res.writeHead(404); res.end("404 Not Found");
      return; 
    } 
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  }); 
} 
  // Function to determine the content type based on the file extension 

function getContentType(filePath) {
  const extname = path.extname(filePath); 
    switch (extname) { 
      case ".html": 
        return "text/html"; 
      case ".css": 
        return "text/css"; 
      case ".js":
        return "text/javascript"; 
      case ".png":
        return "image/png"; 
      case ".jpg": 
      case ".jpeg": 
        return "image/jpeg";
      case ".svg":
        return "image/svg+xml";
      default: 
        return "application/octet-stream"; } 
 }