const http = require('http');
require('dotenv').config();
const data = require('./db');
const { validate } = require('uuid');

const routes = (req, res) => {

  if (req.method === 'GET' && req.url === '/person') {
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } else if (req.method === 'GET' && req.url.match(/^\/person\//) && req.url.split('/').length === 3) {
    const id = req.url.split('/')[2];
    if (!validate(id)) {
      res.writeHead(400);
      res.end('Not valid id ' + id);
      return;
    }
    const person = data.find(item => item.id === id);
    if (!person) {
      res.writeHead(404);
      res.end('Person not found');
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify(person))
  } else if (req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString();
    })
    req.on('end', () => {
      console.log(body);

    })
  } else if (req.method === 'PUT') {

  } else if (req.method === 'DELETE') {

  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
}

const port = process.env.PORT || 3000;
const server = http.createServer(routes);



server.listen(port, () => console.log(`Server is running on ${port}`))

